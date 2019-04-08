// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
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

  public pageURL = '../assets/temppage.json';
  public tagsURL = '../assets/temptags.json';
  public subpageURL = '../assets/tempsubpage.json';
  public connectionURL = '../assets/tempconnections.json';

  // Filters
  
  //includes

  @ViewChildren('nGForArray') filtered;
  public tag: any;
  public searchSubpageTerm = null;
  public tagname: any;

  public topTitle;

  url: string;
  top_page: Page[];
  tags: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];

  
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
    this.getData();
    this.getParams();
  }

  getData(): any {
    this.staffService.getPageData(this.pageURL)
      .subscribe(top_page => {
        this.top_page = top_page;
      });
    this.staffService.getTagData(this.tagsURL)
      .subscribe(tag => {
        this.tag = tag;
      });
    this.staffService.getSubpageData(this.subpageURL)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.staffService.getConnectTags(this.connectionURL)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  getTopTitle(): string {
    let obj;
    this.route.queryParams.subscribe(p => {
      obj = p;
    });
    this.topTitle = Object.values(obj);
    return this.topTitle;
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeSubQuery(queryStrings.source.value);
    });
  }

  addSubQuery(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
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

  executeSubQuery(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.searchSubpageTerm = queries[1];
  }

  clearFilters() {
    this.searchSubpageTerm = null;
  }


}