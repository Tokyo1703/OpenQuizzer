import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuestionariosComponent } from './lista-cuestionarios.component';

describe('ListaCuestionariosComponent', () => {
  let component: ListaCuestionariosComponent;
  let fixture: ComponentFixture<ListaCuestionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCuestionariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
