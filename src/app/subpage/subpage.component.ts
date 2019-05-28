// subpage.components.ts

import { Component, OnInit, Input, ViewEncapsulation, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage, Thumbnails } from '../datatables/page';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// datatables 

@Component({
  selector: 'app-page',
  templateUrl: './subpage.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./subpage.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class SubpageComponent implements OnInit {

  @ViewChildren('nGForArray') filtered;
  @ViewChildren('formPage') formValues;

  public subsearchTerm = null;
  public topTitle;
  public queryStrings;
  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;

  // subpage structure
  public id;
  public title;
  public description;
  public icon;
  public iconClass = 'pe-5x pe-va icon-image';
  public isactive;
  public urltarget;
  public pageid;

  public updatePage: SubPage;
  public updateType: string;
  
  public isCurrent = false;
  public isPageFormVisible = false;
  public sortNumber: number;
  public sortQuantity = 100;

  public relatedPage: string;
  url: string;
  top_page: Page[];
  top_category: Page;
  subpage: SubPage[];
  subpageitems: SubPage[];
  formPage: FormGroup; 
  thumbnails: Thumbnails[];

  relatedPages: string[];

  editPage = {
    id: null,
    pageid: null,
    relatedPage: null,
    title: null,
    description: null,
    icon: null,
    isactive: null,
    url: null,
    urltarget: null,
    sort: null
  }
  
  router: RouterLink;

  constructor(
    private apiService: APIService,
    private modalService: NgbModal,
    private mainApp: AppComponent,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getParams();
    this.getData();
  }

  addSubQuery(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    if (query === "") {
      query = null;
    }
    this._router.navigate(['Subpage_Editor'], {
        queryParams: {
          ...query
        },
        queryParamsHandling: 'merge',
      });
  }

  clearFilters() {
    this.subsearchTerm = null;
  }

  clearForm(): void {
    this.relatedPage = "";
    this.title = "";
    this.pageid = "";
    this.description = "";
    this.icon = "";
    this.iconClass = 'pe-5x pe-va icon-image';
    this.isactive = null;
    this.url = null;
    this.urltarget = "";
    this.id = null;
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  confirmedEdits(): void {
    switch (this.updateType) {
      case 'add': {
        this.createRequest();
        break;
      }
      case 'delete': {
        this.deleteRequest();
        break;
      }
      case 'update': {
        this.updateRequest();
        break;
      }
    }
  }

  createRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;

    this.findPageID();

    const body = {
      "pageid": this.pageid,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "isactive": this.isactive,
      "url": this.url,
      "urltarget": this.urltarget,
      "sort": this.sortNumber
    };
    this.apiService.postSubpageData(body)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );
    this.clearForm();
  }

  deleteRequest(): void {
    this.apiService.removeSubpageData(this.id)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );
    // console.log(this.id);
    this.clearForm();
  }

  editPages(): void {
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


  fillform(single_page): void {
    console.log(single_page);
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.iconClass = 'pe-5x pe-va icon-image ' + single_page.icon;
    this.isactive = single_page.isactive;
    this.pageid = single_page.pageid;
    this.id = single_page.id
    this.isCurrent = true;

    if (!single_page.sort) {
      single_page.sort = 50;
    }
    this.sortNumber = single_page.sort;

    this.relatedPage = this.top_page.find( p => {
       return p.id === this.pageid}).title
    for (let i = 0; i < this.top_page.length; i++) {
        this.relatedPages[i] = this.top_page[i].title;
      }

  }

  fillIcon(icon: string): void {
    this.icon = icon;
    this.setElement("icon", icon);
  }

  findPageID(): void {
    if (!this.pageid) {
      this.pageid = this.top_page.find( t => {
        return t.title === this.relatedPage
      }).id
    }
  }

  getData(): any {
    this.apiService.getPageData(this.mainApp.working_db)
      .subscribe(top_page => {
        this.top_page = top_page;

        this.relatedPages = [];
        for (let i = 0; i < this.top_page.length; i++) {
          this.relatedPages.push(this.top_page[i].title);
        }
        
        this.apiService.getSubpageData(this.mainApp.working_db)
          .subscribe(subpage => {
            this.subpage = subpage;
            this.subpageitems = [];
            for ( let i = 0; i < this.subpage.length; i++ ) {
                this.subpageitems.push(this.subpage[i]);
            }
          });
      });
    this.apiService.getIcons()
      .subscribe(thumbnails => {
        this.thumbnails = thumbnails;
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

  openLGWindow(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  openProofWindow(content, target): void {
    this.editPage.id = this.id;
    this.editPage.pageid = this.pageid;
    this.editPage.relatedPage = this.relatedPage;
    this.editPage.title = this.title;
    this.editPage.description = this.description;
    this.editPage.icon = this.icon;
    this.editPage.url = this.url;
    this.editPage.urltarget = this.urltarget;
    this.editPage.isactive = this.isactive;
    this.editPage.sort = this.sortNumber;
    this.updateType = target;
    this.modalService.open(content);
  }


  setElement(field: string, newValue: string): void {
    switch (field) {
      case 'relatedPage': {
        this.editPage.relatedPage = newValue;
        break;
      }
      case 'title': {
        this.editPage.title = newValue;
        break;
      }
      case 'description': {
        this.editPage.description = newValue;
        break;
      }
      case 'icon': {
        this.iconClass = "pe-5x pe-va icon-image " + newValue;
        this.editPage.icon = newValue;
        break;
      }
      case 'isactive': {
        if (newValue == "true")
        this.editPage.isactive = true;
        break;
      }
      case 'sortNumber': {
        this.editPage.sort = newValue;
        break;
      }
      case 'url': {
        this.editPage.url = newValue;
        break;
      }
      case 'urltarget': {
        this.editPage.urltarget = newValue;
        break;
      }
    }
  }

  updateRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;

    this.findPageID();

    const body = {
      "id": this.id,
      "pageid": this.pageid,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "url": this.url,
      "urltarget": this.urltarget,
      "isactive": this.isactive,
      "sort": this.sortNumber
    };
    this.apiService.updateSubpageData(body)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );
    this.clearForm();
  }
  
}