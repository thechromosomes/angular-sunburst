import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDialogComponent } from './ngx-dialog.component';

describe('NgxDialogComponent', () => {
  let component: NgxDialogComponent;
  let fixture: ComponentFixture<NgxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
