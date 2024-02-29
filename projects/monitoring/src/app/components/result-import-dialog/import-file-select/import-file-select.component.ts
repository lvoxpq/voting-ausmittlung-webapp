/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { EchType, ImportFile } from '../import-file.model';
import { EnumItemDescription, EnumUtil } from '@abraxas/voting-lib';

@Component({
  selector: 'app-import-file-select',
  templateUrl: './import-file-select.component.html',
  styleUrls: ['./import-file-select.component.scss'],
})
export class ImportFileSelectComponent {
  public readonly echTypes: EnumItemDescription<EchType>[];
  public selectedFiles: ImportFile[] = [];
  public selectedEchType: EchType = EchType.Ech0222;
  public draggingFiles: boolean = false;

  @Output()
  public filesChange: EventEmitter<ImportFile[]> = new EventEmitter<ImportFile[]>();

  @ViewChild('fileInput')
  private fileInput!: ElementRef;

  constructor(readonly enumUtil: EnumUtil) {
    this.echTypes = enumUtil.getArrayWithDescriptions<EchType>(EchType, 'RESULT_IMPORT.E_CH_TYPES.');
  }

  @HostListener('window:drop', ['$event'])
  public async onDrop(e: any): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    this.draggingFiles = false;
    this.selectFile(e.dataTransfer.files[0]);
  }

  @HostListener('window:dragover', ['$event'])
  public onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingFiles = true;
  }

  @HostListener('window:dragleave', ['$event'])
  public onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingFiles = false;
  }

  public setFileFromEvent(event: any): void {
    const file: File | undefined = event.target.files[0];
    if (file === undefined) {
      return;
    }

    this.selectFile(file);

    // clear file input, otherwise the same file cannot be selected again
    this.fileInput.nativeElement.value = null;
  }

  public removeFile(importFile: ImportFile): void {
    const index = this.selectedFiles.indexOf(importFile);
    if (index < 0) {
      return;
    }

    this.selectedFiles.splice(index, 1);
    this.selectedFiles = [...this.selectedFiles];
    this.filesChange.emit(this.selectedFiles);
  }

  public selectFile(file: File): void {
    this.selectedFiles = [...this.selectedFiles, { file, echType: this.selectedEchType }];
    this.filesChange.emit(this.selectedFiles);
  }
}
