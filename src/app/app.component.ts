import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  group: string;
  reference: number;
  alarm: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('table') table!: MatTable<PeriodicElement>;
  dataSource = new MatTableDataSource<any>();
  VOForm!: FormGroup;
  isLoading = true;
  previousValues = null;

  displayedColumns: string[] = [
    'name',
    'group',
    'reference',
    'alarm',
    'action',
  ];

  mainData: PeriodicElement[] = [];

  constructor(private fb: FormBuilder, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });

    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.mainData.map((val) =>
          this.fb.group({
            name: new FormControl(val.name),
            group: new FormControl(val.group),
            reference: new FormControl(val.reference),
            alarm: new FormControl(val.alarm),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
        )
      ),
    });

    this.isLoading = false;
    this.dataSource = new MatTableDataSource(
      (this.VOForm.get('VORows') as FormArray).controls
    );

    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    };
  }

  onAddNewRow() {
    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0, this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls);
  }

  onEditSVO(VOFormElement: any, i: number) {
    this.previousValues = VOFormElement.get('VORows').at(i).value;
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
  }

  onSaveVO(VOFormElement: any, i: number) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  onCancelSVO(VOFormElement: any, i: number) {
    if (this.previousValues) {
      VOFormElement.get('VORows').at(i).reset(this.previousValues);
    }
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.previousValues = null;
  }

  onDelete(VOFormElement: any, i: number) {
    const control = this.VOForm.get('VORows') as FormArray;
    control.removeAt(i);
    this.dataSource = new MatTableDataSource(control.controls);
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      name: new FormControl(''),
      group: new FormControl(''),
      reference: new FormControl(''),
      alarm: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }

  dropTable(event: any, VOFormElement: any) {
    const prevIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const control = this.VOForm.get('VORows') as FormArray;
    const item = VOFormElement.get('VORows').at(prevIndex);

    if (prevIndex !== currentIndex) {
      control.removeAt(prevIndex);
      control.insert(currentIndex, item);

      this.dataSource = new MatTableDataSource(control.controls);
    }
  }
}
