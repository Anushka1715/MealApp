import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrdialogComponent } from './qrdialog.component';

describe('QrdialogComponent', () => {
  let component: QrdialogComponent;
  let fixture: ComponentFixture<QrdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrdialogComponent]
    });
    fixture = TestBed.createComponent(QrdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
