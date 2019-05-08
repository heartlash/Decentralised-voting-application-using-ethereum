const NavBar = (
        <Navbar bg="dark" variant="dark" expand = "lg" >
        <Navbar.Brand href="/">SafePoll</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="/admin">Admin</Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
        {this.props.location.pathname == '/vote' ?
        <Navbar.Text>
          VoterId: <a href="#login">{this.props.location.state.voterId}</a>
        </Navbar.Text>
        :
        <Navbar.Text>
          Powered by: <a href="#login">Blockchain</a>
        </Navbar.Text>
        }
        
        </Navbar.Collapse>
        </Navbar>
    )
    





