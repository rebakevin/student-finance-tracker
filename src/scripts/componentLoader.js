const components = {
  header: 'src/components/header.html',
  dashboard: 'src/components/dashboard.html',
  transactions: 'src/components/transactions.html',
  'add-transaction': 'src/components/add-transaction.html',
  settings: 'src/components/settings.html',
  about: 'src/components/about.html',
  'edit-modal': 'src/components/edit-modal.html',
  'confirm-dialog': 'src/components/confirm-dialog.html',
  'status-message': 'src/components/status-message.html',
};

const sectionStyles = {
  dashboard: 'src/styles/sections/_dashboard.css',
  transactions: 'src/styles/sections/_transactions.css',
  'add-transaction': 'src/styles/sections/_add-transaction.css',
  settings: 'src/styles/sections/_settings.css',
  about: 'src/styles/sections/_about.css',
};

const loadedStyles = new Set();

/**
 * Loads a CSS file dynamically
 * @param {string} sectionName - Name of the section
 * @returns {Promise<void>}
 */
function loadSectionCSS(sectionName) {
  return new Promise((resolve, reject) => {
    const cssPath = sectionStyles[sectionName];
    
    if (!cssPath) {
      resolve();
      return;
    }
    
    if (loadedStyles.has(sectionName)) {
      console.log(`✓ CSS already loaded: ${sectionName}`);
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    link.onload = () => {
      loadedStyles.add(sectionName);
      console.log(`✓ Loaded CSS: ${sectionName}`);
      resolve();
    };
    link.onerror = () => {
      console.error(`Failed to load CSS: ${sectionName}`);
      reject(new Error(`Failed to load CSS: ${sectionName}`));
    };
    
    document.head.appendChild(link);
  });
}

/**
 * Loads a component from a file and injects it into a target element
 * @param {string} componentName - Name of the component to load
 * @param {string} targetId - ID of the target element to inject into
 * @param {boolean} loadCSS - Whether to load associated CSS file
 * @returns {Promise<void>}
 */
async function loadComponent(componentName, targetId, loadCSS = false) {
  const componentPath = components[componentName];
  
  if (!componentPath) {
    console.error(`Component "${componentName}" not found`);
    return;
  }

  try {
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentName} (${response.status})`);
    }
    
    const html = await response.text();
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
      console.error(`Target element with ID "${targetId}" not found`);
      return;
    }
    
    targetElement.innerHTML = html;
    console.log(`✓ Loaded component: ${componentName}`);
    
    if (loadCSS && sectionStyles[componentName]) {
      await loadSectionCSS(componentName);
    }
  } catch (error) {
    console.error(`Error loading component "${componentName}":`, error);
  }
}

/**
 * Loads all components in the correct order
 * @param {boolean} lazyLoadCSS - Whether to lazy-load section CSS files
 * @returns {Promise<void>}
 */
async function loadAllComponents(lazyLoadCSS = true) {
  console.log('Loading components...');
  
  try {
    await Promise.all([
      loadComponent('header', 'header-container'),
      loadComponent('dashboard', 'dashboard-container', lazyLoadCSS),
      loadComponent('transactions', 'transactions-container', lazyLoadCSS),
      loadComponent('add-transaction', 'add-transaction-container', lazyLoadCSS),
      loadComponent('settings', 'settings-container', lazyLoadCSS),
      loadComponent('about', 'about-container', lazyLoadCSS),
      loadComponent('edit-modal', 'edit-modal-container'),
      loadComponent('confirm-dialog', 'confirm-dialog-container'),
      loadComponent('status-message', 'status-message-container'),
    ]);
    
    console.log('✓ All components loaded successfully');
    
    const event = new CustomEvent('componentsLoaded');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error loading components:', error);
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
  loadAllComponents();
}

export { loadComponent, loadAllComponents, loadSectionCSS };
