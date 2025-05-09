import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResultadosIndividualesComponent } from './lista-resultados-individuales.component';

describe('ListaResultadosIndividualesComponent', () => {
  let component: ListaResultadosIndividualesComponent;
  let fixture: ComponentFixture<ListaResultadosIndividualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadosIndividualesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadosIndividualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
