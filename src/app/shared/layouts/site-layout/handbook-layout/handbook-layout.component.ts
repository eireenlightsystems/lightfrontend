import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-handbook-layout',
  templateUrl: './handbook-layout.component.html',
  styleUrls: ['./handbook-layout.component.css']
})
export class HandbookLayoutComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

}
