// components/FormBuilder.tsx
"use client";

import { FormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"; // Correct import
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
      {...attributes}
      {...listeners}
      className="flex justify-between items-center p-2 bg-white border rounded-md mb-2 touch-none"
    >
      <span>
        {field.label} ({field.type})
      </span>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function FormBuilder({ formData, setFormData }: FormBuilderProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDelete = (id: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((f) => f.id !== id),
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) { // Check for null over
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