import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useCourse } from '../context/CourseContext';
import Button from './common/Button';
import { GripVertical, Plus, X, Eye, EyeOff } from 'lucide-react';

const SectionBuilder: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ 
  onContinue, 
  onBack 
}) => {
  const { state, dispatch } = useCourse();
  const { sections } = state;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: '',
      description: '',
    };
    
    dispatch({
      type: 'ADD_SECTION',
      payload: newSection,
    });
  };
  
  const updateSection = (id: string, field: 'title' | 'description', value: string) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: {
        id,
        updates: { [field]: value },
      },
    });
    
    // Clear error for this field if it exists
    if (errors[`${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${id}-${field}`];
      setErrors(newErrors);
    }
  };
  
  const removeSection = (id: string) => {
    dispatch({
      type: 'REMOVE_SECTION',
      payload: id,
    });
    
    // Clear any errors for this section
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${id}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    dispatch({
      type: 'REORDER_SECTIONS',
      payload: items,
    });
  };
  
  const validateSections = () => {
    const newErrors: Record<string, string> = {};
    
    if (sections.length === 0) {
      newErrors.general = 'You need to add at least one section';
    } else {
      sections.forEach(section => {
        if (!section.title.trim()) {
          newErrors[`${section.id}-title`] = 'Section title is required';
        }
        if (!section.description.trim()) {
          newErrors[`${section.id}-description`] = 'Section description is required';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    if (validateSections()) {
      onContinue();
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Sections</h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </>
            )}
          </button>
          <span className="text-sm text-gray-500">
            {sections.length} {sections.length === 1 ? 'section' : 'sections'}
          </span>
        </div>
      </div>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}
      
      {isPreviewMode ? (
        <div className="mb-6 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-medium text-gray-800">Course Outline Preview</h3>
          </div>
          <div className="p-4">
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sections added yet</p>
            ) : (
              <ol className="space-y-4">
                {sections.map((section, index) => (
                  <li key={section.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-lg">Section {index + 1}: {section.title || 'Untitled Section'}</h4>
                    <p className="text-gray-600 mt-1">{section.description || 'No description provided'}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 mb-6"
              >
                {sections.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">No sections added yet</p>
                    <Button onClick={addSection} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Your First Section
                    </Button>
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 p-3 border-b flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="mr-2 cursor-grab"
                            >
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="font-medium flex-1">Section {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove section"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <label htmlFor={`title-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Section Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id={`title-${section.id}`}
                                value={section.title}
                                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                  ${errors[`${section.id}-title`] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter section title"
                                maxLength={100}
                              />
                              {errors[`${section.id}-title`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`${section.id}-title`]}</p>
                              )}
                              <div className="text-xs text-right text-gray-500 mt-1">
                                {section.title.length}/100
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor={`description-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Section Description <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                id={`description-${section.id}`}
                                value={section.description}
                                onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                  ${errors[`${section.id}-description`] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter section description"
                                rows={3}
                                maxLength={500}
                              ></textarea>
                              {errors[`${section.id}-description`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`${section.id}-description`]}</p>
                              )}
                              <div className="text-xs text-right text-gray-500 mt-1">
                                {section.description.length}/500
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {!isPreviewMode && sections.length > 0 && (
        <div className="mb-6">
          <Button 
            onClick={addSection} 
            variant="outline" 
            fullWidth
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Another Section
          </Button>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SectionBuilder;