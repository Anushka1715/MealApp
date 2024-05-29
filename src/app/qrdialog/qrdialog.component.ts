import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qrdialog',
  templateUrl: './qrdialog.component.html',
  styleUrls: ['./qrdialog.component.css']
})
export class QrdialogComponent {
  //public qrString:string = "00000000-0000-0000-0000-000000000000ffd23a18-8adf-4eb3-9a2a-c687100c471a"


  constructor(
    public dialogRef: MatDialogRef<QrdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

}
