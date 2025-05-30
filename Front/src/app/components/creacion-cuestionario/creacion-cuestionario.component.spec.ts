import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCuestionarioComponent } from './creacion-cuestionario.component';

describe('CreacionCuestionarioComponent', () => {
  let component: CreacionCuestionarioComponent;
  let fixture: ComponentFixture<CreacionCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreacionCuestionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
