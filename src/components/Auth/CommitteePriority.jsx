import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaLanguage, FaGripVertical, FaChevronDown, FaChevronUp, FaHourglassHalf, FaExclamationTriangle, FaTeamspeak } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import './committeePriority.css'


const CommitteePriority = ({ committees, onChange }) => {
  const { t, i18n } = useTranslation();
  const [expandedCommittee, setExpandedCommittee] = useState(null);
  const [committeesList, setCommitteesList] = useState(committees || []);
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const dragStateRef = useRef({ isDragging: false, startY: 0, currentIndex: -1 });
  
  // Update committees list when props change
  useEffect(() => {
    setCommitteesList(committees || []);
  }, [committees]);

  // Custom function to handle manual reordering for touch devices
  const handleManualReorder = (sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;
    
    // Reorder the list using the utility function
    const newList = reorder({
      list: [...committeesList],
      startIndex: sourceIndex,
      finishIndex: destinationIndex,
    });
    
    // Update priorities
    const updatedCommittees = newList.map((committee, index) => ({
      ...committee,
      priority: index + 1
    }));
    
    setCommitteesList(updatedCommittees);
    onChange(updatedCommittees);
    
    // Add visual feedback for the moved item
    setTimeout(() => {
      const movedElement = itemRefs.current[committeesList[sourceIndex].id];
      if (movedElement) {
        movedElement.classList.add('highlight-move');
        setTimeout(() => {
          movedElement.classList.remove('highlight-move');
        }, 1000);
      }
    }, 100);
  };

  // Set up drag and drop
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanupFns = [];
    
    // Set up each draggable item
    committeesList.forEach((committee, index) => {
      const element = itemRefs.current[committee.id];
      if (!element) return;
      
      const dragHandle = element.querySelector('.drag-handle');
      if (!dragHandle) return;
      
      // Make item draggable with improved touch support
      const cleanup = draggable({
        element,
        dragHandle,
        getInitialData: () => ({
          type: 'committee-item',
          id: committee.id,
          index,
        }),
        canDrag: () => true,
        enableConstrainedMovement: true,
        touchDelayMs: 150, // Reduced delay for better responsiveness
      });
      
      cleanupFns.push(cleanup);
      
      // Make item a drop target
      const dropCleanup = dropTargetForElements({
        element,
        getIsSticky: () => true,
        getData: () => ({
          type: 'committee-item',
          id: committee.id,
          index,
        }),
      });
      
      cleanupFns.push(dropCleanup);
      
      // Add custom touch handlers for mobile fallback
      const handleTouchStart = (e) => {
        if (!e.target.closest('.drag-handle')) return;
        
        // Mark the element as being touched
        element.classList.add('touch-active');
        
        // Store the initial touch position and index
        dragStateRef.current = {
          isDragging: true,
          startY: e.touches[0].clientY,
          currentIndex: index,
          committeeId: committee.id,
          element
        };
        
        // Prevent default to avoid scrolling while trying to drag
        // But only for the drag handle
        if (e.target.closest('.drag-handle')) {
          e.preventDefault();
        }
      };
      
      const handleTouchMove = (e) => {
        if (!dragStateRef.current.isDragging) return;
        
        const { startY, currentIndex, element } = dragStateRef.current;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Add a dragging class for visual feedback
        if (Math.abs(deltaY) > 10) {
          element.classList.add('dragging');
        }
        
        // Find potential drop target based on Y position
        const itemHeight = element.offsetHeight;
        const moveThreshold = itemHeight / 2;
        
        if (Math.abs(deltaY) > moveThreshold) {
          // Calculate the new index based on direction and distance
          const direction = deltaY > 0 ? 1 : -1;
          const moveCount = Math.floor(Math.abs(deltaY) / itemHeight);
          let newIndex = currentIndex + (direction * moveCount);
          
          // Ensure the new index is within bounds
          newIndex = Math.max(0, Math.min(newIndex, committeesList.length - 1));
          
          if (newIndex !== currentIndex) {
            // Update the current index
            dragStateRef.current.currentIndex = newIndex;
            dragStateRef.current.startY = currentY;
            
            // Scroll if needed
            const containerRect = containerRef.current.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            if (elementRect.bottom > containerRect.bottom) {
              containerRef.current.scrollTop += 20;
            } else if (elementRect.top < containerRect.top) {
              containerRef.current.scrollTop -= 20;
            }
          }
        }
        
        // Prevent default to avoid scrolling while dragging
        e.preventDefault();
      };
      
      const handleTouchEnd = (e) => {
        const { isDragging, currentIndex, committeeId } = dragStateRef.current;
        
        if (isDragging && currentIndex !== index) {
          // Perform the reordering
          handleManualReorder(index, currentIndex);
        }
        
        // Reset drag state
        dragStateRef.current = { isDragging: false, startY: 0, currentIndex: -1 };
        
        // Remove visual feedback
        element.classList.remove('touch-active');
        element.classList.remove('dragging');
      };
      
      // Use capture phase to ensure we get the events before they're potentially cancelled
      dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchcancel', handleTouchEnd);
      
      cleanupFns.push(() => {
        dragHandle.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
      });
    });
    
    // Monitor drag and drop operations from the library (for desktop)
    const monitorCleanup = monitorForElements({
      onDragStart({ source }) {
        // Add a class to the dragged item for styling
        if (source.element) {
          source.element.classList.add('dragging');
        }
      },
      onDrop({ source, location }) {
        // Remove dragging class
        if (source.element) {
          source.element.classList.remove('dragging');
        }
        
        // Only handle drops for our committee items
        if (source.data?.type !== 'committee-item') {
          return;
        }
        
        // Find the destination from the drop targets
        const destination = location.current.dropTargets[0];
        if (!destination || !destination.data) {
          return;
        }
        
        const sourceIndex = source.data.index;
        const destinationIndex = destination.data.index;
        
        if (typeof sourceIndex !== 'number' || 
            typeof destinationIndex !== 'number' || 
            sourceIndex === destinationIndex) {
          return;
        }
        
        // Reorder the list using the utility function
        const newList = reorder({
          list: [...committeesList],
          startIndex: sourceIndex,
          finishIndex: destinationIndex,
        });
        
        // Update priorities
        const updatedCommittees = newList.map((committee, index) => ({
          ...committee,
          priority: index + 1
        }));
        
        setCommitteesList(updatedCommittees);
        onChange(updatedCommittees);
        
        // Add visual feedback for the moved item using CSS animation
        setTimeout(() => {
          const movedElement = itemRefs.current[source.data.id];
          if (movedElement) {
            movedElement.classList.add('highlight-move');
            setTimeout(() => {
              movedElement.classList.remove('highlight-move');
            }, 1000);
          }
        }, 100);
      }
    });
    
    cleanupFns.push(monitorCleanup);
    
    // Clean up all handlers when component unmounts
    return () => {
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [committeesList, onChange]);
  
  // Toggle committee description
  const toggleDescription = (id) => {
    setExpandedCommittee(expandedCommittee === id ? null : id);
  };

  // Function to render committee flairs
  const renderCommitteeFlairs = (committee) => {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        <div className="flex flex-wrap gap-2">
  {/* Language/Bilingual Flair */}
  {committee.bilingual ? (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
      <FaLanguage className="mr-1" />
      Bilingual / Bilingue
    </div>
  ) : (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        committee.language === 'fr'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      <FaLanguage className="mr-1" />
      {committee.language === 'fr' ? 'Français' : 'English'}
    </div>
  )}

  {/* Historical Flair */}
  {committee.historical && (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <FaHourglassHalf className="mr-1" />
      Historique
    </div>
  )}

  {/* Crisis Flair */}
  {committee.crisis && (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <FaExclamationTriangle className="mr-1" />
      Crise
    </div>
  )}
</div>


        {/* Binomial indicator */}
        {committee.binomial && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <AiOutlineTeam className="mr-1" />

            {i18n.language === 'fr' ? 'BINÔME' : 'BINOMIAL'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4 committee-container" ref={containerRef}>
      <h3 className="text-lg font-medium mb-2">{t("auth.committeePrioritiesDescription")}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {t("auth.dragToReorder")}
      </p>

      <div className="space-y-2">
        {committeesList.map((committee, index) => (
          <div
            key={committee.id}
            ref={el => itemRefs.current[committee.id] = el}
            className="bg-white border border-gray-200 rounded-md shadow-sm p-3 relative touch-manipulation committee-item"
            data-committee-id={committee.id}
            data-index={index}
          >
            <div className="flex items-center">
              <div 
                className="drag-handle cursor-move mr-2 text-gray-400 hover:text-gray-600 flex items-center justify-center p-3"
                role="button"
                aria-label={t("auth.dragToReorder")}
                tabIndex={0}
              >
                <FaGripVertical size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="font-medium">
                      {i18n.language === "fr" ? committee.nameFr : committee.nameEn}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDescription(committee.id)}
                    className="text-gray-400 hover:text-gray-600 p-3"
                    aria-label={
                      expandedCommittee === committee.id
                        ? t("auth.hideDescription")
                        : t("auth.showDescription")
                    }
                  >
                    {expandedCommittee === committee.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>
                {renderCommitteeFlairs(committee)}
                {expandedCommittee === committee.id && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      {i18n.language === "fr"
                        ? committee.descriptionFr
                        : committee.descriptionEn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default CommitteePriority;