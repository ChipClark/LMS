// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, SubPage } from '../datatables/page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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

  public internal = true;   /// Change to false to use external db
  public external = false;

  // Filters
  
  //includes

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
    this.staffService.getPageData(this.internal)
      .subscribe(top_page => {
        this.top_page = top_page;
        for ( let i = 0; i < this.top_page.length; i++ ) {
          this.top_page[i].intid = parseInt(this.top_page[i].id);
        }
        this.getTopTitle();
        this.top_category = this.top_page.find( p => {
          return p.title === this.topTitle[0]
        });
      });
    this.staffService.getSubpageData(this.internal)
      .subscribe(subpage => {
        this.subpage = subpage;
        for ( let i = 0; i < this.subpage.length; i++ ) {
          this.subpage[i].intid = parseInt(this.subpage[i].id);
          this.subpage[i].top_id = parseInt(this.subpage[i].pageid);
        }
        this.subpageitems = [];
        for ( let i = 0; i < this.subpage.length; i++ ) {
          if (this.subpage[i].top_id == this.top_category.intid) {
            this.subpageitems.push(this.subpage[i]);
          }
        }
          
      });
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
    console.log(values);
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