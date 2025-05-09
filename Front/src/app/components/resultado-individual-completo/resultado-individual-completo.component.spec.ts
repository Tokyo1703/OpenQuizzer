import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoIndividualCompletoComponent } from './resultado-individual-completo.component';

describe('ResultadoIndividualCompletoComponent', () => {
  let component: ResultadoIndividualCompletoComponent;
  let fixture: ComponentFixture<ResultadoIndividualCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoIndividualCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoIndividualCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
