import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunburstGraphComponent } from './sunburst-graph.component';

describe('SunburstGraphComponent', () => {
  let component: SunburstGraphComponent;
  let fixture: ComponentFixture<SunburstGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunburstGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunburstGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
