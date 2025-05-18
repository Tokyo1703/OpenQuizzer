import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoGrupalCompletoComponent } from './resultado-grupal-completo.component';

describe('ResultadoGrupalCompletoComponent', () => {
  let component: ResultadoGrupalCompletoComponent;
  let fixture: ComponentFixture<ResultadoGrupalCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoGrupalCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoGrupalCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
