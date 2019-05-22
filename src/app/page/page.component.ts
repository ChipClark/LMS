// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class PageComponent implements OnInit {

  public internal = true;    // change to false to use external db
  public external = false;
  
  //includes

  @ViewChildren('nGForArray')filtered;
  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;
  public CLE = 'CLE';
  public HR = 'HR';
  public Skills = 'Skills';

  url: string;
  top_page: Page[];
  tagsArray: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];

  
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
    this.getData();
    this.getParams();
  }

  getData(): any {
    //console.log(this.baseURL);
    this.staffService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(this.top_page);
      });
    this.staffService.getTagData(this.mainApp.internal_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.staffService.getSubpageData(this.mainApp.internal_db)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.staffService.getConnectTags(this.mainApp.internal_db)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getTags(page): string {
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        pagetags = pagetags + (page.tags[i].tag);
        if (page.tags[i + 1]) {
          pagetags = pagetags + ", ";
        }
      }
    }
    return pagetags;
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tag':
          this.tag = values[0];
          break;
      }
    }
    if (keys[0] === 'tag') {

      this._router.navigate([''], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate([''], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tag':
          this.tag = q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;

      }
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

}


