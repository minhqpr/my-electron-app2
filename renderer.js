// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...')
  
  const information = document.getElementById('info')
  if (information) {
    information.innerText = `This app is using Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
  }

  // Initialize server port
  let serverPort = 9999 // Default port
  
  // Listen for server port updates
  if (window.electronAPI) {
    window.electronAPI.onServerPortUpdate((port) => {
      serverPort = port
      console.log(`Server port updated to: ${port}`)
    })
  }

  // Get DOM elements
  const submitBtn = document.getElementById('submitBtn')
  const responseContainer = document.getElementById('responseContainer')
  const responseElement = document.getElementById('response')
  const responseDetails = document.getElementById('responseDetails')
  const timestamp = document.getElementById('timestamp')
  const loadingIndicator = document.getElementById('loadingIndicator')

  // Debug: Check if elements are found
  console.log('DOM elements found:', {
    submitBtn: !!submitBtn,
    responseContainer: !!responseContainer,
    responseElement: !!responseElement,
    responseDetails: !!responseDetails,
    timestamp: !!timestamp,
    loadingIndicator: !!loadingIndicator
  })

  if (!submitBtn) {
    console.error('Submit button not found!')
    return
  }

  // Function to get current timestamp
  function getCurrentTimestamp() {
    return new Date().toLocaleTimeString()
  }

  // Function to show/hide elements
  function showElement(element) {
    element.style.display = 'block'
  }

  function hideElement(element) {
    element.style.display = 'none'
  }

  // Function to call the local web server
  async function callLocalServer() {
    console.log('Submit button clicked! Starting request...')
    const startTime = Date.now()
    
    try {
      // Show loading state
      submitBtn.disabled = true
      submitBtn.textContent = 'Connecting...'
      submitBtn.classList.add('loading')
      hideElement(responseContainer)
      showElement(loadingIndicator)
      
      console.log(`Making request to http://localhost:${serverPort}...`)

      // Make a request to the local server
      const response = await fetch(`http://localhost:${serverPort}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      console.log('Response received:', response.status, response.statusText)
      const endTime = Date.now()
      const responseTime = endTime - startTime

      if (response.ok) {
        const data = await response.text()
        console.log('Response data:', data)
        
        // Update response display
        responseElement.textContent = data
        responseElement.classList.add('success')
        
        // Update details
        responseDetails.innerHTML = `
          <strong>Status:</strong> ${response.status} ${response.statusText} | 
          <strong>Response Time:</strong> ${responseTime}ms | 
          <strong>Content-Type:</strong> ${response.headers.get('content-type') || 'text/plain'}
        `
        
        // Update timestamp
        timestamp.textContent = getCurrentTimestamp()
        
        // Show response container
        showElement(responseContainer)
        
        console.log('✅ Server response received:', data)
      } else {
        // Handle HTTP error
        responseElement.textContent = `HTTP Error: ${response.status} ${response.statusText}`
        responseElement.classList.add('error')
        
        responseDetails.innerHTML = `
          <strong>Status:</strong> ${response.status} ${response.statusText} | 
          <strong>Response Time:</strong> ${responseTime}ms
        `
        
        timestamp.textContent = getCurrentTimestamp()
        showElement(responseContainer)
        
        console.error('❌ HTTP error:', response.status, response.statusText)
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      // Handle network/connection errors
      responseElement.textContent = `Connection Error: ${error.message}`
      responseElement.classList.add('error')
      
      responseDetails.innerHTML = `
        <strong>Error Type:</strong> ${error.name} | 
        <strong>Response Time:</strong> ${responseTime}ms
      `
      
      timestamp.textContent = getCurrentTimestamp()
      showElement(responseContainer)
      
      console.error('❌ Network error:', error)
    } finally {
      // Reset button state
      submitBtn.disabled = false
      submitBtn.textContent = 'Submit Request'
      submitBtn.classList.remove('loading')
      hideElement(loadingIndicator)
    }
  }

  // Add click event listener to the submit button
  submitBtn.addEventListener('click', callLocalServer)
  console.log('Event listener added to submit button')

  // Hover effects are now handled by CSS

  console.log('App initialization complete!')
})

// Fallback for when DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded, trigger the initialization
  document.dispatchEvent(new Event('DOMContentLoaded'))
}
