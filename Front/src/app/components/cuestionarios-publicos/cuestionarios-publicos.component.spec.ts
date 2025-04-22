import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionariosPublicosComponent } from './cuestionarios-publicos.component';

describe('CuestionariosPublicosComponent', () => {
  let component: CuestionariosPublicosComponent;
  let fixture: ComponentFixture<CuestionariosPublicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuestionariosPublicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuestionariosPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
