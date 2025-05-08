import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

interface DialogData {
  uid: string;
  teamId: string;
  name: string;
  runs: number;
  wickets: number;
  deliveries: number;
  fieldToEdit: 'runs' | 'wickets' | 'deliveries';
}

@Component({
  selector: 'app-edit-score-dialog',
  templateUrl: './edit-score-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
  ],
})
export class EditScoreDialogComponent {
  runsOptions = [0, 1, 2, 3, 4, 5, 6];
  wicketsOptions = [0, 1];

  constructor(
    public dialogRef: MatDialogRef<EditScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    // Validate inputs
    if (this.data.runs < 0 || this.data.runs > 6) {
      alert('Runs must be between 0 and 6');
      return;
    }
    if (this.data.wickets < 0 || this.data.wickets > 1) {
      alert('Wickets must be 0 or 1');
      return;
    }
    if (this.data.deliveries !== 1) {
      alert('Deliveries must be 1 per ball');
      return;
    }

    this.dialogRef.close({
      uid: this.data.uid,
      teamId: this.data.teamId,
      runs: this.data.runs,
      wickets: this.data.wickets,
      deliveries: this.data.deliveries
    });
  }
}