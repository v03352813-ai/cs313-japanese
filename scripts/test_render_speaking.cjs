const { createServer } = require('vite');

async function runTest() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  try {
    const React = await vite.ssrLoadModule('react');
    const ReactDOMServer = await vite.ssrLoadModule('react-dom/server');
    const { AISpeakingView } = await vite.ssrLoadModule('/src/components/AISpeakingView.tsx');
    
    console.log('Rendering AISpeakingView...');
    const html = ReactDOMServer.renderToString(React.createElement(AISpeakingView));
    console.log('SSR Render SUCCESS! HTML length:', html.length);
  } catch (err) {
    console.error('SSR Render FAILED with error:');
    console.error(err);
  } finally {
    await vite.close();
  }
}
runTest();
