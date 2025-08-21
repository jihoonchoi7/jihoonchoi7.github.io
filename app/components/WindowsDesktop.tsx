'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { SocialButtons } from './SocialButtons';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface BrowserWindow {
  id: string;
  tabs: Tab[];
  activeTabId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  type: 'file' | 'folder' | 'trash';
}

export function WindowsDesktop() {
  const [browserWindows, setBrowserWindows] = useState<BrowserWindow[]>([]);
  const [showBio, setShowBio] = useState(false);
  const [bioWindow, setBioWindow] = useState({
    x: 300,
    y: 200,
    zIndex: 10
  });
  const [showContact, setShowContact] = useState(false);
  const [contactWindow, setContactWindow] = useState({
    x: 350,
    y: 250,
    zIndex: 10
  });
  const [highestZIndex, setHighestZIndex] = useState(10);
  const [showRecycleConfirm, setShowRecycleConfirm] = useState(false);
  const [isBlackholeActive, setIsBlackholeActive] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    { id: 'bio', name: 'BIO.txt', icon: '📄', x: 50, y: 50, type: 'file' },
    { id: 'projects', name: 'Projects', icon: '📁', x: 50, y: 130, type: 'folder' },
    { id: 'contact', name: 'Contact.txt', icon: '📄', x: 50, y: 210, type: 'file' },
    { id: 'internet', name: 'Internet Explorer', icon: '🌐', x: 50, y: 290, type: 'file' },
    { id: 'trash', name: 'Recycle Bin', icon: '🗑️', x: 50, y: 370, type: 'trash' }
  ]);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [iconDragOffset, setIconDragOffset] = useState({ x: 0, y: 0 });
  
  // Window and tab dragging state
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [draggedTabFromWindow, setDraggedTabFromWindow] = useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);
  const [dragOverWindow, setDragOverWindow] = useState<string | null>(null);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'tab' | 'window' | null>(null);


  const createNewWindow = useCallback((initialTabs: Tab[] = [], x = 200, y = 100) => {
    const newWindow: BrowserWindow = {
      id: `window-${Date.now()}`,
      tabs: initialTabs.length > 0 ? initialTabs : [{
        id: `tab-${Date.now()}`,
        title: 'New Tab',
        content: <div className="p-4">What&apos;s up?</div>
      }],
      activeTabId: initialTabs[0]?.id || `tab-${Date.now()}`,
      x,
      y,
      width: 800,
      height: 600,
      isMaximized: false,
      isMinimized: false,
      zIndex: highestZIndex + 1
    };
    setHighestZIndex(prev => prev + 1);
    setBrowserWindows(prev => [...prev, newWindow]);
    return newWindow;
  }, [highestZIndex]);

  const createNewTab = (windowId: string) => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: `New Tab`,
      content: <div className="p-4">What&apos;s up?</div>
    };
    
    setBrowserWindows(prev => prev.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          tabs: [...window.tabs, newTab],
          activeTabId: newTab.id
        };
      }
      return window;
    }));
  };

  const closeTab = (windowId: string, tabId: string) => {
    setBrowserWindows(prev => prev.map(window => {
      if (window.id === windowId) {
        const newTabs = window.tabs.filter(tab => tab.id !== tabId);
        if (newTabs.length === 0) {
          // Close the window if no tabs left
          return null;
        }
        return {
          ...window,
          tabs: newTabs,
          activeTabId: window.activeTabId === tabId ? newTabs[0].id : window.activeTabId
        };
      }
      return window;
    }).filter(Boolean) as BrowserWindow[]);
  };

  const minimizeWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, isMinimized: true } : window
    ));
  };

  const maximizeWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, isMaximized: !window.isMaximized } : window
    ));
  };

  const closeWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.filter(window => window.id !== windowId));
  };

  const restoreWindow = (windowId: string) => {
    setBrowserWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, isMinimized: false } : window
    ));
  };

  const bringWindowToFront = useCallback((windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setBrowserWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, zIndex: newZIndex } : window
    ));
  }, [highestZIndex]);

  const bringBioToFront = useCallback(() => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setBioWindow(prev => ({ ...prev, zIndex: newZIndex }));
  }, [highestZIndex]);

  const bringContactToFront = useCallback(() => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setContactWindow(prev => ({ ...prev, zIndex: newZIndex }));
  }, [highestZIndex]);

  const handleIconMouseDown = useCallback((e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedIcon(iconId);
    setIconDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedIcon) {
      const newIcons = desktopIcons.map(icon => {
        if (icon.id === draggedIcon) {
          return {
            ...icon,
            x: e.clientX - iconDragOffset.x,
            y: e.clientY - iconDragOffset.y
          };
        }
        return icon;
      });
      setDesktopIcons(newIcons);
    }
  }, [draggedIcon, iconDragOffset, desktopIcons]);

  const handleMouseUp = useCallback(() => {
    setDraggedIcon(null);
  }, []);

  // Window dragging handlers
  const handleWindowMouseDown = useCallback((e: React.MouseEvent, windowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedWindow(windowId);
    setDragType('window');
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    bringWindowToFront(windowId);
  }, [bringWindowToFront]);

  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
    if (draggedWindow && dragType === 'window') {
      setBrowserWindows(prev => prev.map(window => {
        if (window.id === draggedWindow && !window.isMaximized) {
          return {
            ...window,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          };
        }
        return window;
      }));
    }
  }, [draggedWindow, dragType, dragOffset]);

  const handleWindowMouseUp = useCallback(() => {
    setDraggedWindow(null);
    setDragType(null);
  }, []);

  // BIO window dragging handlers
  const handleBioMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Calculate offset from the window's current position, not the header
    setDraggedWindow('bio-window');
    setDragType('window');
    setDragOffset({
      x: e.clientX - bioWindow.x,
      y: e.clientY - bioWindow.y
    });
    bringBioToFront();
  }, [bioWindow.x, bioWindow.y, bringBioToFront]);

  // Contact window dragging handlers
  const handleContactMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedWindow('contact-window');
    setDragType('window');
    setDragOffset({
      x: e.clientX - contactWindow.x,
      y: e.clientY - contactWindow.y
    });
    bringContactToFront();
  }, [contactWindow.x, contactWindow.y, bringContactToFront]);

  const handleBioMouseMove = useCallback((e: MouseEvent) => {
    if (draggedWindow === 'bio-window' && dragType === 'window') {
      setBioWindow(prev => ({
        ...prev,
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }));
    }
  }, [draggedWindow, dragType, dragOffset]);

  const handleBioMouseUp = useCallback(() => {
    if (draggedWindow === 'bio-window') {
      setDraggedWindow(null);
      setDragType(null);
    }
  }, [draggedWindow]);

  const handleContactMouseMove = useCallback((e: MouseEvent) => {
    if (draggedWindow === 'contact-window' && dragType === 'window') {
      setContactWindow(prev => ({
        ...prev,
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }));
    }
  }, [draggedWindow, dragType, dragOffset]);

  const handleContactMouseUp = useCallback(() => {
    if (draggedWindow === 'contact-window') {
      setDraggedWindow(null);
      setDragType(null);
    }
  }, [draggedWindow]);

  // Tab drag handlers - removed unused function

  const handleTabMouseMove = useCallback((e: MouseEvent) => {
    if (draggedTab && dragType === 'tab') {
      setIsDragging(true);
      console.log('Tab mouse move:', draggedTab);
      
      // Find which window/tab we're hovering over
      const windowElements = document.querySelectorAll('.browser-window');
      let hoveredWindowId = null;
      let hoveredTabId = null;
      
      for (const windowElement of windowElements) {
        const windowRect = windowElement.getBoundingClientRect();
        if (e.clientX >= windowRect.left && e.clientX <= windowRect.right && 
            e.clientY >= windowRect.top && e.clientY <= windowRect.bottom) {
          hoveredWindowId = windowElement.getAttribute('data-window-id');
          
          // Check if we're over a specific tab in this window
          const tabElements = windowElement.querySelectorAll('.tab:not(.new-tab-button)');
          for (const tabElement of tabElements) {
            const tabRect = tabElement.getBoundingClientRect();
            if (e.clientX >= tabRect.left && e.clientX <= tabRect.right && 
                e.clientY >= tabRect.top && e.clientY <= tabRect.bottom) {
              hoveredTabId = tabElement.getAttribute('data-tab-id');
              break;
            }
          }
          break;
        }
      }
      
      setDragOverWindow(hoveredWindowId);
      setDragOverTab(hoveredTabId);
    }
  }, [draggedTab, dragType]);

  const handleTabMouseUp = useCallback((e: MouseEvent) => {
    console.log('Tab mouse up:', draggedTab, 'over window:', dragOverWindow, 'over tab:', dragOverTab, 'isDragging:', isDragging);
    
    if (draggedTab && draggedTabFromWindow && isDragging) {
      // Find the dragged tab data
      const sourceWindow = browserWindows.find(w => w.id === draggedTabFromWindow);
      const draggedTabData = sourceWindow?.tabs.find(t => t.id === draggedTab);
      
      if (draggedTabData) {
        if (dragOverWindow && dragOverWindow !== draggedTabFromWindow) {
          // Moving tab to a different window
          console.log('Moving tab to different window');
          
          // Remove tab from source window
          setBrowserWindows(prev => prev.map(window => {
            if (window.id === draggedTabFromWindow) {
              const newTabs = window.tabs.filter(tab => tab.id !== draggedTab);
              if (newTabs.length === 0) {
                return null; // This window will be closed
              }
              return {
                ...window,
                tabs: newTabs,
                activeTabId: window.activeTabId === draggedTab ? newTabs[0].id : window.activeTabId
              };
            }
            return window;
          }).filter(Boolean) as BrowserWindow[]);
          
          // Add tab to target window
          setBrowserWindows(prev => prev.map(window => {
            if (window.id === dragOverWindow) {
              let insertIndex = window.tabs.length;
              if (dragOverTab) {
                insertIndex = window.tabs.findIndex(tab => tab.id === dragOverTab);
              }
              const newTabs = [...window.tabs];
              newTabs.splice(insertIndex, 0, draggedTabData);
              return {
                ...window,
                tabs: newTabs,
                activeTabId: draggedTabData.id
              };
            }
            return window;
          }));
          
        } else if (dragOverTab && dragOverTab !== draggedTab && dragOverWindow === draggedTabFromWindow) {
          // Reordering within the same window
          console.log('Reordering tabs within window');
          setBrowserWindows(prev => prev.map(window => {
            if (window.id === draggedTabFromWindow) {
              const draggedIndex = window.tabs.findIndex(tab => tab.id === draggedTab);
              const targetIndex = window.tabs.findIndex(tab => tab.id === dragOverTab);
              
              if (draggedIndex !== -1 && targetIndex !== -1) {
                const newTabs = [...window.tabs];
                const [draggedTabData] = newTabs.splice(draggedIndex, 1);
                newTabs.splice(targetIndex, 0, draggedTabData);
                return { ...window, tabs: newTabs };
              }
            }
            return window;
          }));
          
        } else if (!dragOverWindow && isDragging) {
          // Detaching tab to create new window
          console.log('Detaching tab to new window');
          
          // Remove tab from source window
          setBrowserWindows(prev => prev.map(window => {
            if (window.id === draggedTabFromWindow) {
              const newTabs = window.tabs.filter(tab => tab.id !== draggedTab);
              if (newTabs.length === 0) {
                return null; // This window will be closed
              }
              return {
                ...window,
                tabs: newTabs,
                activeTabId: window.activeTabId === draggedTab ? newTabs[0].id : window.activeTabId
              };
            }
            return window;
          }).filter(Boolean) as BrowserWindow[]);
          
          // Create new window with the detached tab
          createNewWindow([draggedTabData], e.clientX - 400, e.clientY - 50);
        }
      }
    }
    
    setDraggedTab(null);
    setDraggedTabFromWindow(null);
    setDragOverTab(null);
    setDragOverWindow(null);
    setIsDragging(false);
    setDragType(null);
  }, [draggedTab, draggedTabFromWindow, dragOverWindow, dragOverTab, isDragging, browserWindows, createNewWindow]);

  const handleTabClick = useCallback((windowId: string, tabId: string) => {
    setBrowserWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, activeTabId: tabId } : window
    ));
  }, []);

  // Add event listeners for drag
  useEffect(() => {
    if (draggedIcon) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedIcon, handleMouseMove, handleMouseUp]);

  // Add event listeners for window and tab drag
  useEffect(() => {
    if (draggedWindow || draggedTab) {
      const handleMouseMove = (e: MouseEvent) => {
        if (draggedWindow === 'bio-window' && dragType === 'window') {
          handleBioMouseMove(e);
        } else if (draggedWindow === 'contact-window' && dragType === 'window') {
          handleContactMouseMove(e);
        } else if (draggedWindow && dragType === 'window') {
          handleWindowMouseMove(e);
        } else if (draggedTab && dragType === 'tab') {
          handleTabMouseMove(e);
        }
      };
      
      const handleMouseUp = (e: MouseEvent) => {
        if (draggedWindow === 'bio-window' && dragType === 'window') {
          handleBioMouseUp();
        } else if (draggedWindow === 'contact-window' && dragType === 'window') {
          handleContactMouseUp();
        } else if (draggedWindow && dragType === 'window') {
          handleWindowMouseUp();
        } else if (draggedTab && dragType === 'tab') {
          handleTabMouseUp(e);
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedWindow, draggedTab, dragType, handleWindowMouseMove, handleWindowMouseUp, handleBioMouseMove, handleBioMouseUp, handleContactMouseMove, handleContactMouseUp, handleTabMouseMove, handleTabMouseUp]);

  const handleIconDoubleClick = (iconId: string) => {
    if (iconId === 'bio') {
      setShowBio(true);
      bringBioToFront();
    } else if (iconId === 'contact') {
      setShowContact(true);
      bringContactToFront();
    } else if (iconId === 'trash') {
      setShowRecycleConfirm(true);
    } else if (iconId === 'projects') {
      const projectsTab: Tab = {
        id: 'projects-tab',
        title: 'Projects',
        content: <ProjectsContent />
      };
      createNewWindow([projectsTab]);
    } else if (iconId === 'internet') {
      const homeTab: Tab = {
        id: 'home-tab',
        title: 'Home',
        content: <HomeContent />
      };
      createNewWindow([homeTab]);
    }
  };

  const handleTrashDrop = (iconId: string) => {
    if (iconId !== 'trash') {
      setDesktopIcons(desktopIcons.filter(icon => icon.id !== iconId));
    }
  };

  const handleRecycleConfirm = () => {
    setShowRecycleConfirm(false);
    setIsBlackholeActive(true);
    
    // After 5 seconds of blackhole animation, start rebooting sequence
    setTimeout(() => {
      setIsBlackholeActive(false);
      setIsRebooting(true);
      
      // Reset all windows and states during reboot
      setBrowserWindows([]);
      setShowBio(false);
      setShowContact(false);
      
      // After 3 seconds of loading, restore everything
      setTimeout(() => {
        setIsRebooting(false);
        // Reset icon positions
        setDesktopIcons([
          { id: 'bio', name: 'BIO.txt', icon: '📄', x: 50, y: 50, type: 'file' },
          { id: 'projects', name: 'Projects', icon: '📁', x: 50, y: 130, type: 'folder' },
          { id: 'contact', name: 'Contact.txt', icon: '📄', x: 50, y: 210, type: 'file' },
          { id: 'internet', name: 'Internet Explorer', icon: '🌐', x: 50, y: 290, type: 'file' },
          { id: 'trash', name: 'Recycle Bin', icon: '🗑️', x: 50, y: 370, type: 'trash' }
        ]);
      }, 3000);
    }, 5000);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${isBlackholeActive ? 'tv-shutdown-active' : ''}`}>
      {/* Background Elements */}
      <div className="background-elements">
        {/* Clouds */}
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
        <div className="cloud cloud-6"></div>
        
        {/* Trees */}
        <div className="tree tree-1">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-2">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-3">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-4">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-5">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-6">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-7">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <div className="tree tree-8">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        
        {/* Flowers */}
        <div className="flower flower-red"></div>
        <div className="flower flower-yellow"></div>
        <div className="flower flower-pink"></div>
        <div className="flower flower-blue"></div>
        <div className="flower flower-white"></div>
        <div className="flower flower-orange"></div>
        <div className="flower flower-purple"></div>
        <div className="flower flower-cyan"></div>
        <div className="flower flower-lime"></div>
        <div className="flower flower-magenta"></div>
        <div className="flower flower-gold"></div>
        <div className="flower flower-coral"></div>
      </div>

      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className="desktop-icon"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            zIndex: draggedIcon === icon.id ? 1000 : 5
          }}
          onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
          onDoubleClick={() => handleIconDoubleClick(icon.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => icon.type === 'trash' && draggedIcon && handleTrashDrop(draggedIcon)}
        >
          <div className="icon-placeholder">
            {icon.icon}
          </div>
          <span>{icon.name}</span>
        </div>
      ))}

      {/* Browser Windows */}
      {browserWindows.map((browserWindow) => !browserWindow.isMinimized && (
        <div 
          key={browserWindow.id}
          data-window-id={browserWindow.id}
          className={`browser-window window ${dragOverWindow === browserWindow.id ? 'drag-target' : ''}`}
          style={{
            position: 'absolute',
            ...(browserWindow.isMaximized ? {
              top: '0px',
              left: '0px',
              right: '0px',
              bottom: '30px'
            } : {
              top: `${browserWindow.y}px`,
              left: `${browserWindow.x}px`,
              width: `${browserWindow.width}px`,
              height: `${browserWindow.height}px`
            }),
            zIndex: browserWindow.zIndex,
            cursor: draggedWindow === browserWindow.id ? 'grabbing' : 'default'
          }}
          onClick={() => bringWindowToFront(browserWindow.id)}
        >
          {/* Window Header */}
          <div 
            className="window-header"
            onMouseDown={(e) => handleWindowMouseDown(e, browserWindow.id)}
            style={{ cursor: draggedWindow === browserWindow.id ? 'grabbing' : 'grab' }}
          >
            <span>🌐 Internet Explorer</span>
            <div className="window-controls">
              <button 
                className="window-control-button minimize-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(browserWindow.id);
                }} 
                title="Minimize"
              >
                _
              </button>
              <button 
                className="window-control-button maximize-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  maximizeWindow(browserWindow.id);
                }} 
                title={browserWindow.isMaximized ? "Restore" : "Maximize"}
              >
                {browserWindow.isMaximized ? '⧉' : '□'}
              </button>
              <button 
                className="window-control-button close-button-header" 
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(browserWindow.id);
                }} 
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Tab Bar */}
          <div className="tab-bar">
            {browserWindow.tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                className={`tab ${browserWindow.activeTabId === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(browserWindow.id, tab.id)}
                style={{
                  cursor: 'pointer'
                }}
              >
                <span className="tab-title" style={{ pointerEvents: 'none' }}>
                  {tab.title}
                </span>
                <span
                  className="ml-2 cursor-pointer hover:bg-red-500 hover:text-white px-1 tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(browserWindow.id, tab.id);
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  ×
                </span>
              </div>
            ))}
            <div className="new-tab-button" onClick={() => createNewTab(browserWindow.id)}>
              +
            </div>
          </div>

          {/* Window Content */}
          <div className="bg-white overflow-auto p-4" style={{ height: 'calc(100% - 64px)' }}>
            {browserWindow.tabs.find(tab => tab.id === browserWindow.activeTabId)?.content}
          </div>
        </div>
      ))}

      {/* Bio Window */}
      {showBio && (
        <div 
          className="bio-window window" 
          style={{
            position: 'absolute',
            left: `${bioWindow.x}px`,
            top: `${bioWindow.y}px`,
            zIndex: bioWindow.zIndex,
            cursor: draggedWindow === 'bio-window' ? 'grabbing' : 'default'
          }}
          onClick={bringBioToFront}
        >
          <div 
            className="window-header"
            onMouseDown={handleBioMouseDown}
            style={{ cursor: draggedWindow === 'bio-window' ? 'grabbing' : 'grab' }}
          >
            <span>BIO.txt - Notepad</span>
            <button 
              className="close-button" 
              onClick={(e) => {
                e.stopPropagation();
                setShowBio(false);
              }}
            >
              ×
            </button>
          </div>
          <div className="bio-content">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold' }}>
              About Jihoon Choi
            </h3>
            <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
              <p><strong>🌏 Origin Story:</strong><br />
              Born in South Korea, raised in the Philippines for 18 years. Finished high school at Midtown High in Atlanta, GA.</p>
              
              <p><strong>🎹 Musical Journey:</strong><br />
              Studied Piano at SMU in Dallas, TX. Fun fact: My professor is 4 handshakes away from Beethoven, making me the 5th handshake away from the maestro himself!</p>
              
              <p><strong>❤️ Love & Life:</strong><br />
              Met the love of my life in college. And we are married!!
              </p>
              
              <p><strong>🎯 Current Focus</strong><br />
              I&apos;m just tyring to understand what AI Code Reviews are...</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Window */}
      {showContact && (
        <div 
          className="contact-window window" 
          style={{
            position: 'absolute',
            left: `${contactWindow.x}px`,
            top: `${contactWindow.y}px`,
            zIndex: contactWindow.zIndex,
            cursor: draggedWindow === 'contact-window' ? 'grabbing' : 'default'
          }}
          onClick={bringContactToFront}
        >
          <div 
            className="window-header"
            onMouseDown={handleContactMouseDown}
            style={{ cursor: draggedWindow === 'contact-window' ? 'grabbing' : 'grab' }}
          >
            <span>Contact.txt - Notepad</span>
            <button 
              className="close-button" 
              onClick={(e) => {
                e.stopPropagation();
                setShowContact(false);
              }}
            >
              ×
            </button>
          </div>
          <div className="bio-content">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold' }}>
              Contact Information
            </h3>
            <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
              <p><strong>📧 Email:</strong><br />
              <a href="mailto:jihoonchoi465@gmail.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                jihoonchoi465@gmail.com
              </a></p>
              
              <p><strong>🌐 Social Media:</strong><br />
              Feel free to connect with me on any of the platforms linked on the homepage!</p>
              
              <p><strong>📍 Location:</strong><br />
              I&apos;m currenlty based in SF. North Beach area!<br />
              </p>
              
              <p><strong>💼 Professional:</strong><br />
              Working in Sales at Greptile<br />
              </p>
              
              <p><strong>🎼 Fun Fact:</strong><br />
              I swam in a live volcano once in the Philippines!</p>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <div className="start-button">
          <span>🪟</span>
          Start
        </div>
        <div className="flex-1 flex gap-1 ml-2">
          {browserWindows.filter(w => w.isMinimized).map(window => (
            <div 
              key={window.id}
              className="taskbar-item" 
              onClick={() => restoreWindow(window.id)}
            >
              🌐 Internet Explorer ({window.tabs.length} tabs)
            </div>
          ))}
        </div>
        <div className="text-xs px-2">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Recycle Bin Confirmation Popup */}
      {showRecycleConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-200 border-2 border-gray-600 p-6 shadow-lg" style={{ 
            background: 'var(--windows-gray)',
            border: '2px outset var(--windows-gray)'
          }}>
            <div className="text-center mb-6">
              <div className="text-2xl mb-2">🗑️</div>
              <p className="text-sm font-bold mb-2">Are you sure?</p>
              <p className="text-xs text-gray-600">This will activate the void...</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowRecycleConfirm(false)}
                className="px-4 py-2 bg-gray-200 border-2 border-gray-400 text-xs hover:bg-gray-300"
                style={{
                  background: 'var(--windows-gray)',
                  border: '2px outset var(--windows-gray)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRecycleConfirm}
                className="px-4 py-2 bg-red-600 border-2 border-red-800 text-white text-xs hover:bg-red-700"
                style={{
                  background: '#cc0000',
                  border: '2px outset #cc0000'
                }}
              >
                Empty Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TV Static Shutdown Overlay */}
      {isBlackholeActive && (
        <div className="tv-shutdown-overlay fixed inset-0 z-[10000]">
          <div className="static-noise"></div>
          <div className="tv-scanlines"></div>
          <div className="tv-shutdown-line"></div>
        </div>
      )}

      {/* Reboot Loading Screen */}
      {isRebooting && (
        <div className="reboot-screen fixed inset-0 bg-black z-[10000] flex items-center justify-center">
          <div className="loading-container">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p className="loading-text">Rebooting system...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'serif' }}>
        Welcome to Jihoon&apos;s Digital Desktop
      </h1>
      <p className="text-lg mb-8">
        Want to learn more about Jihoon?
      </p>
      <SocialButtons />
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'serif' }}>
        Projects
      </h2>
      <div className="text-lg text-gray-600 mb-4">
        🚧
      </div>
      <p className="text-lg" style={{ fontFamily: 'serif' }}>
        Coming soon...
      </p>
      <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: 'serif' }}>
        Exciting projects in development!
      </p>
    </div>
  );
}
