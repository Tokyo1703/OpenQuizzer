import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResultadosGrupalesComponent } from './lista-resultados-grupales.component';

describe('ListaResultadosGrupalesComponent', () => {
  let component: ListaResultadosGrupalesComponent;
  let fixture: ComponentFixture<ListaResultadosGrupalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadosGrupalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadosGrupalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
