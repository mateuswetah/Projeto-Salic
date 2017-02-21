import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  PRONAC: Number = 1;
  queryUF: String = 'GO';
  inscricao: Subscription; // Usada para observar mudanças na URL

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.inscricao = this.route.queryParams.subscribe (
      (queryParams: any) => {
        if (queryParams['UF']) {
          this.queryUF = queryParams['UF'];
        }
      }
    );

  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onUpdateQuery() {
    this.queryUF = 'SP';
    this.router.navigate([''], { queryParams: {'UF': this.queryUF}});
  }

}
