import { Component, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-sierpinski',
  imports: [ReactiveFormsModule],
  templateUrl: './sierpinski.html',
  styleUrl: './sierpinski.scss',
})
export class Sierpinski {
  private svg!: d3.Selection<d3.BaseType, unknown, null, undefined>;
  private readonly width = 600;
  private readonly height = 600;
  private readonly depth = 6; // how many recursion levels
  public selectColor = new FormControl('reds');

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initializeSierpinski();
  }

  private initializeSierpinski() {
    this.svg = d3
      .select(this.el.nativeElement)
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Define points of the large outer triangle
    const points: [number, number][] = [
      [this.width / 2, 20], // top vertex
      [20, this.height - 20], // bottom-left
      [this.width - 20, this.height - 20], // bottom-right
    ];

    this.drawTriangle(points, this.depth);
  }

  private drawTriangle(points: [number, number][], depth: number) {
    if (depth === 0) {
      // Draw filled triangle at recursion end
      this.svg
        .append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', d3.interpolateRainbow(Math.random()))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);
      return;
    }

    // Midpoints of the triangle sides
    const [a, b, c] = points;
    const ab: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const bc: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
    const ca: [number, number] = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];

    // Recurse into 3 outer triangles
    this.drawTriangle([a, ab, ca], depth - 1);
    this.drawTriangle([ab, b, bc], depth - 1);
    this.drawTriangle([ca, bc, c], depth - 1);
  }

  downloadSVG() {
    if (!this.svg) return;

    // Get the actual SVG element
    const svgElement = this.svg.node();
    if (!svgElement) return;

    // Serialize SVG content
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement as SVGSVGElement);

    // Add XML header (helps some SVG viewers)
    const svgBlob = new Blob(
      ['<?xml version="1.0" standalone="no"?>\n', svgString],
      { type: 'image/svg+xml;charset=utf-8' }
    );

    // Create a download link
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      'treeDepth' +
      this.depth +
      'color' +
      this.selectColor.value +
      '.svg';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
