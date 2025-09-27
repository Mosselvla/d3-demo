import { Component, ElementRef, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  public svg:
    | d3.Selection<SVGSVGElement, unknown, null, undefined>
    | undefined = undefined;
  public readonly title = signal('d3-demo');
  public startX = 550;
  public startY = 550;
  public depth = 10;
  public topAngle = -90;
  public bottomAngle = 90;
  public recursion1AngleMod = 45;
  public recursion2AngleMod = 45;
  public lengthBase = 0.75;

  public selectColor = new FormControl('reds');

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initializeTree();
    this.selectColor.valueChanges.subscribe((res) => {
      this.svg!.selectAll('*').remove();
      this.initializeTree();
    });
  }

  public increaseRecursion1Mod() {
    this.recursion1AngleMod += 15;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public increaseRecursion2Mod() {
    this.recursion2AngleMod += 15;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public decreaseRecursion1Mod() {
    this.recursion1AngleMod -= 15;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public decreaseRecursion2Mod() {
    this.recursion2AngleMod -= 15;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public increaseDepth() {
    this.depth += 1;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public decreaseDepth() {
    this.depth -= 1;
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public increaseLengthBase() {
    this.lengthBase += 0.05;
    Math.round(this.lengthBase);
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  public decreaseLengthBase() {
    this.lengthBase -= 0.05;
    Math.round(this.lengthBase);
    this.svg!.selectAll('*').remove();
    this.initializeTree();
  }

  private initializeTree() {
    this.svg = d3.select(this.el.nativeElement).select('svg') as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;
    this.drawTree(
      this.svg,
      this.startX,
      this.startY,
      this.topAngle,
      this.depth
    );
    this.drawTree(
      this.svg,
      this.startX,
      this.startY,
      this.bottomAngle,
      this.depth
    );
  }

  // Recursive method to draw branches
  private drawTree(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x1: number,
    y1: number,
    angle: number,
    depth: number
  ) {
    if (depth === 0 || depth < 0) return;

    const length = Math.pow(this.lengthBase, this.depth - depth) * 100;
    const x2 = x1 + length * Math.cos((angle * Math.PI) / 180);
    const y2 = y1 + length * Math.sin((angle * Math.PI) / 180);

    svg
      .append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', this.getStrokeColor(depth))
      .attr('stroke-width', Math.max(depth * 1.5));

    this.drawTree(svg, x2, y2, angle - this.recursion1AngleMod, depth - 1);
    this.drawTree(svg, x2, y2, angle + this.recursion2AngleMod, depth - 1);
  }

  downloadSVG() {
    if (!this.svg) return;

    // Get the actual SVG element
    const svgElement = this.svg.node();
    if (!svgElement) return;

    // Serialize SVG content
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

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
      'Length' +
      this.lengthBase +
      'rec1Mod' +
      this.recursion1AngleMod +
      'rec2Mod' +
      this.recursion2AngleMod +
      '.svg';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private getStrokeColor(
    depth: number
  ):
    | string
    | number
    | boolean
    | readonly (string | number)[]
    | d3.ValueFn<
        SVGLineElement,
        unknown,
        string | number | boolean | readonly (string | number)[] | null
      >
    | null {
    if (this.selectColor.value === 'reds') {
      return d3.interpolateReds(depth / this.depth);
    }
    if (this.selectColor.value === 'blues') {
      return d3.interpolateBlues(depth / this.depth);
    }
    if (this.selectColor.value === 'greens') {
      return d3.interpolateGreens(depth / this.depth);
    }
    if (this.selectColor.value === 'rainbow') {
      return d3.interpolateRainbow(depth / this.depth);
    }
    if (this.selectColor.value === 'inferno') {
      return d3.interpolateInferno(depth / this.depth);
    }
    if (this.selectColor.value === 'plasma') {
      return d3.interpolatePlasma(depth / this.depth);
    }
    if (this.selectColor.value === 'brbg') {
      return d3.interpolateBrBG(depth / this.depth);
    }
    if (this.selectColor.value === 'bugn') {
      return d3.interpolateBuGn(depth / this.depth);
    }
    if (this.selectColor.value === 'bupu') {
      return d3.interpolateBuPu(depth / this.depth);
    }
    if (this.selectColor.value === 'cividis') {
      return d3.interpolateCividis(depth / this.depth);
    }
    if (this.selectColor.value === 'cool') {
      return d3.interpolateCool(depth / this.depth);
    }
    if (this.selectColor.value === 'gnbu') {
      return d3.interpolateGnBu(depth / this.depth);
    }
    if (this.selectColor.value === 'magma') {
      return d3.interpolateMagma(depth / this.depth);
    }
    if (this.selectColor.value === 'orrd') {
      return d3.interpolateOrRd(depth / this.depth);
    }
    if (this.selectColor.value === 'piyg') {
      return d3.interpolatePiYG(depth / this.depth);
    }
    if (this.selectColor.value === 'turbo') {
      return d3.interpolateTurbo(depth / this.depth);
    }
    if (this.selectColor.value === 'spectral') {
      return d3.interpolateSpectral(depth / this.depth);
    }
    // Return a default color if none match
    return '#fff'; // white as default
  }
}
