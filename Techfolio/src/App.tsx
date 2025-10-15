import { FrappeProvider } from 'frappe-react-sdk'
import Portfolio from './components/Portfolio'
function App() {
	return (
		<div className="App">
			<FrappeProvider>
				<div>
					<Portfolio/>
				</div>
			</FrappeProvider>
		</div>
	)
}
export default App
























