import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sierpinski } from './sierpinski';

describe('Sierpinski', () => {
  let component: Sierpinski;
  let fixture: ComponentFixture<Sierpinski>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sierpinski]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sierpinski);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
