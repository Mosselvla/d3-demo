import { Routes } from '@angular/router';
import { Tree } from './tree/tree';
import { Sierpinski } from './sierpinski/sierpinski';

export const routes: Routes = [
    {
        path: 'tree',
        component: Tree
    },
    {
        path: 'sierpinski',
        component: Sierpinski
    }
];
