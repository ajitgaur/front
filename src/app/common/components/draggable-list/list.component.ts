import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  DndDropEvent,
  EffectAllowed,
  DndDragImageOffsetFunction,
} from 'ngx-drag-drop';

@Component({
  selector: 'm-draggableList',
  templateUrl: 'list.component.html',
})
export class DraggableListComponent {
  @Input() data: Array<any>;
  @Input() dndEffectAllowed: EffectAllowed = 'copyMove';
  @Input() id: string;
  @Input() headers: string[];
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
  @Output() emptyListHeaderRowClicked: EventEmitter<any> = new EventEmitter();
  @Output() arrayChanged: EventEmitter<any> = new EventEmitter();

  dragging: boolean = false;

  trackByFunction(index, item) {
    return this.id ? item[this.id] + index : index;
  }

  onDrop(event: DndDropEvent) {
    this.dragging = false;
    console.log(event);
    if (
      this.data &&
      (event.dropEffect === 'copy' || event.dropEffect === 'move')
    ) {
      let dragIndex = this.data.findIndex(
        item => event.data[this.id] === item[this.id]
      );
      let dropIndex = event.index;
      // remove element
      this.data.splice(dragIndex, 1);

      // add it back to new index
      if (dragIndex < dropIndex) {
        dropIndex--;
      }

      this.data.splice(dropIndex, 0, event.data);
      this.arrayChanged.emit(this.data);
    }
  }

  removeItem(index) {
    console.log('***databefore removal', this.data, index);
    this.data.splice(index, 1);
    this.arrayChanged.emit(this.data);
    console.log('***dataafter removal', this.data);
  }

  clickedHeaderRow($event) {
    if (this.data.length === 0) {
      this.emptyListHeaderRowClicked.emit($event);
    }
  }

  dragImageOffsetRight: DndDragImageOffsetFunction = (
    event: DragEvent,
    dragImage: HTMLElement
  ) => {
    return {
      x: dragImage.offsetWidth - 57,
      y: event.offsetY + 10,
    };
  };
}
