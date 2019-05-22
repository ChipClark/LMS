// subpage.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, SubPage } from '../datatables/page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';

import { PageComponent } from '../page/page.component';

// datatables 

@Component({
  selector: 'app-page',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class SubpageComponent implements OnInit {

  @ViewChildren('nGForArray') filtered;
  public subsearchTerm = null;
  public topTitle;
  public queryStrings;

  url: string;
  top_page: Page[];
  top_category: Page;
  subpage: SubPage[];
  subpageitems: SubPage[];

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private staffService: APIService,
    private mainApp: AppComponent,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getParams();
    this.getData();
    
  }

  getData(): any {
    this.staffService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        console.log(this.top_page);
        this.getTopTitle();
        this.top_category = this.top_page.find( p => {
          return p.title === this.topTitle[0]
        });
        this.staffService.getSubpageData(this.mainApp.internal_db)
          .subscribe(subpage => {
            this.subpage = subpage;
            this.subpageitems = [];
            for ( let i = 0; i < this.subpage.length; i++ ) {
              if (this.subpage[i].pageid == this.top_category.id) {
                this.subpageitems.push(this.subpage[i]);
              }
            }
          });
      });
    
      this.getTopTitle();
  }

  getTopTitle(): void {
    let obj;
    this.route.queryParams.subscribe(p => {
      obj = p;
    });
    this.topTitle = Object.values(obj);
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      this.queryStrings = this.route.queryParamMap;
      // this.executeSubQuery(this.queryStrings.source.value);
    });
  }

  addSubQuery(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    if (query === "") {
      query = null;
    }
    this._router.navigate(['course'], {
        queryParams: {
          ...query
        },
        queryParamsHandling: 'merge',
      });
  }

  executeSubQuery(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.subsearchTerm = queries[1];
  }

  clearFilters() {
    this.subsearchTerm = null;
  }
}