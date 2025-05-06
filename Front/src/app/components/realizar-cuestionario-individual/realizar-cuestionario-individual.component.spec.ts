import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarCuestionarioIndividualComponent } from './realizar-cuestionario-individual.component';

describe('RealizarCuestionarioIndividualComponent', () => {
  let component: RealizarCuestionarioIndividualComponent;
  let fixture: ComponentFixture<RealizarCuestionarioIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarCuestionarioIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarCuestionarioIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
