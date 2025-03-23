// components/FormBuilder.tsx
"use client";

import { FormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react"; // Add GripVertical for drag handle
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormBuilderProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

function SortableField({ field, onDelete }: { field: FormData["fields"][0]; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-2 bg-white border rounded-md mb-2"
    >
      <div className="flex items-center flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab mr-2 touch-none" // Drag handle only
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <span>
          {field.label} ({field.type})
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete} // Direct onDelete call
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function FormBuilder({ formData, setFormData }: FormBuilderProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDelete = (id: string) => {
    console.log("Deleting field:", id); // Debug log
    const newFields = formData.fields.filter((f) => f.id !== id);
    setFormData({
      ...formData,
      fields: newFields,
    });
    console.log("Updated fields:", newFields); // Verify update
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formData.fields.findIndex((field) => field.id === active.id);
      const newIndex = formData.fields.findIndex((field) => field.id === over.id);
      setFormData({
        ...formData,
        fields: arrayMove(formData.fields, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg sm:text-xl font-bold">{formData.name}</h2>
      {formData.fields.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">No fields added yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={formData.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {formData.fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                onDelete={() => handleDelete(field.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}