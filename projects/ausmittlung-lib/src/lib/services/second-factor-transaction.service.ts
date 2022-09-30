/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService } from '@abraxas/voting-lib';
import { Injectable } from '@angular/core';
import { RpcError } from 'grpc-web';
import { defer, Observable, of, OperatorFunction, throwError } from 'rxjs';
import { concatMap, retryWhen } from 'rxjs/operators';
import {
  SecondFactorTransactionDialogComponent,
  SecondFactorTransactionDialogData,
} from '../components/transaction-request-dialog/second-factor-transaction-dialog.component';

const ERROR_TYPE_SEPARATOR = ':';
const ERROR_TYPE_VERIFY_SECOND_FACTOR = 'VerifySecondFactorTimeoutException';
const RETRY_COUNT = 5;

@Injectable({
  providedIn: 'root',
})
export class SecondFactorTransactionService {
  constructor(private readonly dialog: DialogService) {}

  public showDialogAndExecuteVerifyAction<T>(action: () => Observable<T>, code: string): Promise<void> {
    const data: SecondFactorTransactionDialogData = {
      code: code,
    };
    const dialogRef = this.dialog.open<SecondFactorTransactionDialogComponent>(SecondFactorTransactionDialogComponent, data);

    return new Promise<void>((resolve, reject) => {
      const subscription = action()
        .pipe(this.retryOnVerifyTimeout())
        .subscribe(
          () => {
            dialogRef.close();
            resolve();
          },
          err => {
            dialogRef.componentInstance.hasError = true;
            reject(err);
          },
        );

      dialogRef.afterClosed().subscribe(() => {
        subscription.unsubscribe();
        reject();
      });
    });
  }

  private retryOnVerifyTimeout<T>(): OperatorFunction<T, T> {
    return (src: Observable<T>) =>
      defer(() => {
        // retry on failure after timeout
        return src.pipe(
          retryWhen(errs =>
            errs.pipe(
              concatMap((err, index) => {
                const grpcError = err as RpcError;
                const errorType = grpcError?.message?.split(ERROR_TYPE_SEPARATOR)[0];

                // after timeout retry x times (see RETRY_COUNT)
                if (errorType === ERROR_TYPE_VERIFY_SECOND_FACTOR && index < RETRY_COUNT) {
                  return of(null);
                }

                return throwError(err);
              }),
            ),
          ),
        );
      });
  }
}
