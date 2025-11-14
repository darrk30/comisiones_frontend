import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './extrapages/page404/page404.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { KeycloakSsoGuard } from './core/guards/auth-sso.guard';


export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "",
        component: LayoutComponent,
        loadChildren: () =>
            import("./features/private/reporting/reporting.module").then((m) => m.ReportingModule),
        canActivate: [KeycloakSsoGuard],
    },
    {
        path: "negocio",
        component: LayoutComponent,
        loadChildren: () =>
            import("./features/private/business/business.module").then((m) => m.BusinessModule),
        canActivate: [KeycloakSsoGuard],
    },
    {
        path: "mantenimiento",
        component: LayoutComponent,
        loadChildren: () =>
            import("./features/private/maintenance/maintenance.module").then((m) => m.MaintenanceModule),
        canActivate: [KeycloakSsoGuard],
    },
    {
        path: "reporte",
        component: LayoutComponent,
        loadChildren: () =>
            import("./features/private/reporting/reporting.module").then((m) => m.ReportingModule),
        canActivate: [KeycloakSsoGuard],
    },
    {
        path: "pages",
        loadChildren: () =>
            import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
        canActivate: [KeycloakSsoGuard],
    },
    { path: "**", component: Page404Component },
];
