import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISession } from '../models/session.model';

@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss'],
})
export class ViewSessionComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewSessionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISession
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
