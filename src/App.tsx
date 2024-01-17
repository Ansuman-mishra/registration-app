import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Box, Container, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import "datatables.net-dt/css/jquery.dataTables.css";
function App() {
    return (
        <>
            <Provider store={store}>
                <Container maxWidth="xl">
                    <Box sx={{ height: "100vh" }}>
                        <Typography variant="h2" color="text.primary" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                            User Registration App
                        </Typography>
                        <Box mt="50px">
                            <RegistrationForm />
                        </Box>
                    </Box>
                </Container>
            </Provider>
        </>
    );
}

export default App;
