import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuestionariosCreadorComponent } from './lista-cuestionarios-creador.component';

describe('ListaCuestionariosCreadorComponent', () => {
  let component: ListaCuestionariosCreadorComponent;
  let fixture: ComponentFixture<ListaCuestionariosCreadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCuestionariosCreadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCuestionariosCreadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
