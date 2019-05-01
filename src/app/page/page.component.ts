// page.components.ts

import { Component, OnInit, Input, ViewEncapsulation, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage, Thumbnails } from '../datatables/page';
// import { DialogWindow } from '../opendialog/opendialog.component'
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParseSourceSpan } from '@angular/compiler';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
// import { AnyARecord } from 'dns';
// import { MdCheckboxModule } from '@angular/material';

// datatables 


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class PageComponent implements OnInit {

  //includes

  @ViewChildren('nGForArray')filtered;
  @ViewChildren('formPage') formValues;

  public tags: Tags[];
  public tag = null;
  public newTag = false;
  public newPage = false;
  public searchTerm = null;
  public tagname: any;
  public title;
  public description;
  public icon;
  public isactive;
  public sidebar;
  public id;
  public pageID: number;
  public updatePage: Page;
  public updateType: string;
  public existingData: Promise<boolean>;

  
  public isPageFormVisible = false;
  public isCurrent = false;

  url: string;
  top_page: Page[];
  currentPage: any[];
  tagsArray: Tags[];
  tagsSelect: Array<Tags> = [];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];
  formPage: FormGroup; 
  thumbnails: Thumbnails[];

  editPage = {
    title: null,
    description: null,
    icon: null,
    is_active: null,
    sidebar: null,
    id: null,
    tags: null
  }

  

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private apiService: APIService,
    private modalService: NgbModal,
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

      this._router.navigate(['edit'], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate(['edit'], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

  clearForm(): void {
    this.title = "";
    this.description = "";
    this.icon = "";
    this.isactive = null;
    this.sidebar = null;
    this.id = null;
    this.clearCheckedTags()
  }

  clearCheckedTags(): void {
    for(let i = 0; i < this.tagsArray.length; i++) {
      this.tagsArray[i].isChecked = false;
    }
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
    if (this.isactive == "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    this.apiService.postPageData(body).toPromise().then(
      result => {
        let dumpme = result;
        console.log(result);
        this.apiService.getPageData(this.mainApp.working_db).toPromise().then(
          p => {
            this.top_page = p;
            this.updateTags(this.top_page[this.top_page.length - 1].id);
          }
        )
      }
    );

    this.clearForm();
  }

  deleteRequest(): void {
    this.apiService.removePageData(this.id)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
        
      );
    var tempTag: assoc_top_tag[];
  
    tempTag = this.connect_tags.filter( t => {
      return t.pageid === this.id
    });                                                   //  These are the existing tags for the page

    for (let i = 0; i < tempTag.length; i++) {
      this.apiService.removeConnectTags(tempTag[i].id)
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


  fillform(single_page): void {
    this.clearCheckedTags()
    this.isPageFormVisible = true;
    this.id = single_page.id
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.sidebar = single_page.sidebar;
    this.isCurrent = true;
    this.tagsSelect = single_page.tags;

    const body = {
      "id": this.id,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "isactive": this.isactive,
      "sidebar": this.sidebar,
    };

    for (let i = 0; i < this.tagsSelect.length; i++) {
      for (let j = 0; j < this.tagsArray.length; j++) {
        if (this.tagsSelect[i].id == this.tagsArray[j].id) {
          this.tagsArray[j].isChecked = true;
          this.tagsSelect[i].isChecked = true;
        }
      }
    }
    this.editPage = single_page;
    for (let i = 0; i < this.editPage.tags.length; i++) {
      this.editPage.tags[i].isChecked = true;
    }
  }

  fillIcon(icon: string): void {
    this.icon = icon;
    this.setElement("icon", icon);
  }

  getData(): any {
    //console.log(this.baseURL);
    this.apiService.getPageData(this.mainApp.working_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(this.top_page);
      });
    this.apiService.getTagData(this.mainApp.working_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.apiService.getSubpageData(this.mainApp.working_db)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.apiService.getConnectTags(this.mainApp.working_db)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
      });

    this.apiService.getIcons()
      .subscribe(thumbnails => {
        this.thumbnails = thumbnails;
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getFormTags(page): string {
    // console.log(page);
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        if (page.tags[i].isChecked == true) {
          pagetags = pagetags + (page.tags[i].tag);
          if (page.tags[i + 1] ) {
            pagetags = pagetags + ", ";
          }
        }
      }
    }
    return pagetags;
  }

  getTags(page): string {
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        pagetags = pagetags + (page.tags[i].tag);
        if (page.tags[i + 1] ) {
          pagetags = pagetags + ", ";
        }
      }
    }
    // console.log(pagetags)
    return pagetags;
  }

  openProofWindow(content, target): void {
    this.updateType = target;
    this.modalService.open(content);
  }

  openLGWindow(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  setElement(field: string, newValue: string): void {
    switch (field) {
      case 'title': {
        this.editPage.title = newValue;
        break;
      }
      case 'description': {
        this.editPage.description = newValue;
        break;
      }
      case 'icon': {
        this.editPage.icon = newValue;
        break;
      }
      case 'is_active': {
        if (newValue == "true")
        this.editPage.is_active = true;
        break;
      }
      case 'sidebar': {
        this.editPage.sidebar = newValue;
        break;
      }
    }
  }

  setUpdatePage(): void {
    this.updatePage = this.top_page[0];   // initialize array
    this.updatePage.id = null;            // then clear it
    this.updatePage.title = null;
    this.updatePage.description = null;
    this.updatePage.icon = null;
    this.updatePage.is_active = false;
    this.updatePage.sidebar = null;
    this.updatePage.tags = null;
  }

  tagChecked(t: string): void {
    this.newTag = true;
    this.newPage = true;
    let tempTag = this.tagsArray.find( t1 => {
      return t1.tag === t
    });

    tempTag.isChecked = !tempTag.isChecked;

    for (let i = 0; i < this.top_page.length; i++) {
      if (this.top_page[i].title == this.editPage.title ) {
        this.newPage = false;
        for (let j = 0; j < this.top_page[i].tags.length; j++) {
          if (this.top_page[i].tags[j].tag == t) {
            this.top_page[i].tags[j].isChecked = !this.top_page[i].tags[j].isChecked;
            this.top_page[i].tags[j].update = true;
            this.newTag = false;
            this.editPage = this.top_page[i];
          }
        }
        if (this.newTag == true) {
          let tempT = this.tagsArray.find( q => {
            return q.tag === t
          })

          this.editPage.tags[this.editPage.tags.length] = ( {
            "id": tempT.id,
            "tag": t,
            "isChecked": true,
            "update": true
          })
        }
      }
    }

    if (this.newPage == true) {
      let tempT = this.tagsArray.find( q => {
        return q.tag === t
      })

      if (!this.editPage.tags) {
        this.editPage.tags = ( [{
          "id": tempT.id,
          "tag": t,
          "isChecked": true,
          "update": true
        }])
      }
      else {
        this.editPage.tags[this.editPage.tags.length] = ( {
          "id": tempT.id,
          "tag": t,
          "isChecked": true,
          "update": true
        })
      }
    }
  }

  updateDb(): void {
    this.apiService.getPageData(this.mainApp.working_db)
      .subscribe(top_page => {
        this.top_page = top_page;
      });
    console.log("in updateDb");
    console.log(this.top_page);
    this.pageID = this.top_page[this.top_page.length].id;
  }

  updatePageID(): void {
    if (!this.pageID) {
      console.log('in the updatePageID');
      this.title = this.editPage.title;
      console.log('the title is ' + this.title);
      console.log(this.top_page);
      return;
      this.pageID = this.top_page.find( p=> {
        return p.title === this.title
      }).id
    }
  }

  updateRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;

    const body = {
      "id": this.id,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };


    this.apiService.updatePageData(body).toPromise().then(
      result => {
        let dumpme = result;
        console.log(result);
        this.updateTags(this.id);
      }
    );
  }

  updateTags(id: number): void {
    this.pageID = id;
    this.updatePageID();

    console.log("Page ID is " + this.pageID);

    for (let i = 0; i < this.editPage.tags.length; i++) {
      if (!this.editPage.tags[i].update || this.editPage.tags[i].update == false) {
      }
      else if (this.editPage.tags[i].update == true && this.editPage.tags[i].isChecked == true) {
        
        console.log("Page ID is " + this.pageID);
    
        const tagBody = {
          "pageid": this.pageID,
          "tagid": this.editPage.tags[i].id,
          "isActive": true
        }
        this.apiService.postConnectTags(tagBody).toPromise().then(
          result => {
            let dumpme = result;
            console.log(result);
          }
        )
      }

      else if (this.editPage.tags[i].update == true && this.editPage.tags[i].isChecked == false) {
        console.log("Page ID is " + this.pageID);
        let tempAssocID = this.connect_tags.find( t => {
          return t.pageid === this.pageID && t.tagid === this.editPage.tags[i].id
        })
        const tagBody = {
          'id': tempAssocID.id
        }
        this.apiService.removeConnectTags(tempAssocID.id).toPromise().then(
          result => {
            let dumpme = result;
            console.log(result);
          }
        );
      }
    }
  }

}
