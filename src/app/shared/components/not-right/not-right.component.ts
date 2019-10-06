import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

export interface DialogData {
  titleMessage: string;
  notrightMessage: string;
}


@Component({
  selector: 'app-not-right',
  templateUrl: './not-right.component.html',
  styleUrls: ['./not-right.component.css']
})
export class NotRightComponent implements OnInit {

  // variables from parent component
  @Input() message: string;

  constructor(
    public dialog: MatDialog,
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(NotRightDialogComponent, {
      data: {
        titleMessage: this.message,
        notrightMessage: this.translate.instant('site.menu.administration.right-page.not-right')
      }
    });
  }
}

@Component({
  selector: 'app-not-right-dialog',
  templateUrl: './not-right-dialog.component.html',
})
export class NotRightDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
