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

/**
 * Loads a component from a file and injects it into a target element
 * @param {string} componentName - Name of the component to load
 * @param {string} targetId - ID of the target element to inject into
 * @returns {Promise<void>}
 */
async function loadComponent(componentName, targetId) {
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
  } catch (error) {
    console.error(`Error loading component "${componentName}":`, error);
  }
}

/**
 * Loads all components in the correct order
 * @returns {Promise<void>}
 */
async function loadAllComponents() {
  console.log('Loading components...');
  
  try {
    await Promise.all([
      loadComponent('header', 'header-container'),
      loadComponent('dashboard', 'dashboard-container'),
      loadComponent('transactions', 'transactions-container'),
      loadComponent('add-transaction', 'add-transaction-container'),
      loadComponent('settings', 'settings-container'),
      loadComponent('about', 'about-container'),
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

export { loadComponent, loadAllComponents };
