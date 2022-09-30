/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-import-file-select',
  templateUrl: './import-file-select.component.html',
  styleUrls: ['./import-file-select.component.scss'],
})
export class ImportFileSelectComponent {
  public selectedFile?: File;
  public draggingFiles: boolean = false;
  public loading: boolean = false;

  @Output()
  public fileChange: EventEmitter<File | undefined> = new EventEmitter<File | undefined>();

  @ViewChild('fileInput')
  private fileInput!: ElementRef;

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

  public selectFile(file?: File): void {
    this.selectedFile = file;
    this.fileChange.emit(file);
  }
}
