loadFirms() {
    fetch(APIURL+"fcar")
        .then(res => res.json())
        .then(
            (result) => {
                const listFcar = result.map((d) =>
                    <Cell>{result.name}</Cell>
                );
                console.log(listFcar);
                return (
                    <List>
                        {listFcar}
                    </List>
                );
            },
            // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
            // чтобы не перехватывать исключения из ошибок в самих компонентах.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
}

<Cell onClick={() => this.setState({ fcar: 'ВАЗ', activeView: 'garage' })}
      asideContent={this.state.fcar === 'ВАЗ' ? <Icon24Done fill="var(--accent)" /> : null}>ВАЗ</Cell>