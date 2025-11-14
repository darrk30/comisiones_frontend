import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
    currentPage = signal<number>(1);
    pageSize = signal<number>(5);
    totalItems = signal<number>(0);

    setPage(page: number) {
        this.currentPage.set(page);
    }

    setPageSize(size: number) {
        this.pageSize.set(size);
    }

    setTotalItems(total: number) {
        this.totalItems.set(total);
    }
}
