import React from 'react';
import {
    Div,
    Button,
    Checkbox,
    Input,
    FormLayout,
    FormLayoutGroup,
    Panel,
    Group,
    PanelHeader,
    PanelHeaderBack,
    Select
} from "@vkontakte/vkui";

class Addcar extends React.Component {
    render(){
        const boxStyle = {marginTop: 56};
        return (
            <Panel id="addcar">
                <PanelHeader
                    left={<PanelHeaderBack />}
                >
                    Добавить в гараж
                </PanelHeader>
                <Group>
                    <Div>Добавление авто</Div>
                    <Div>
                        <Select name="firm" id="firm" onChange={loadModels()}>
                            <option value="0">Выберите марку авто</option>
                            <option value="26">AC</option>
                            <option value="21">Acura</option>
                            <option value="27">Alfa Romeo</option>
                            <option value="28">Alpina</option>
                            <option value="29">Asia</option>
                            <option value="30">Aston Martin</option>
                            <option value="31">Audi</option>
                            <option value="32">Bentley</option>
                            <option value="33">BMW</option>
                            <option value="98">Brilliance</option>
                            <option value="34">Bugatti</option>
                            <option value="35">Buick</option>
                            <option value="36">BYD</option>
                            <option value="37">Cadillac</option>
                            <option value="119">Changan</option>
                            <option value="38">Chery</option>
                            <option value="39">Chevrolet</option>
                            <option value="40">Chrysler</option>
                            <option value="41">Citroen</option>
                            <option value="110">Dacia</option>
                            <option value="42">Daewoo</option>
                            <option value="1">Daihatsu</option>
                            <option value="43">Daimler</option>
                            <option value="116">Datsun</option>
                            <option value="134">DeLorean</option>
                            <option value="94">Derways</option>
                            <option value="44">Dodge</option>
                            <option value="125">Dongfeng</option>
                            <option value="138">DW Hower</option>
                            <option value="45">Eagle</option>
                            <option value="46">FAW</option>
                            <option value="47">Ferrari</option>
                            <option value="48">Fiat</option>
                            <option value="123">Fisker</option>
                            <option value="49">Ford</option>
                            <option value="137">Foton</option>
                            <option value="140">GAC</option>
                            <option value="52">Geely</option>
                            <option value="135">Genesis</option>
                            <option value="51">Geo</option>
                            <option value="53">GMC</option>
                            <option value="54">Great Wall</option>
                            <option value="109">Hafei</option>
                            <option value="106">Haima</option>
                            <option value="126">Haval</option>
                            <option value="132">Hawtai</option>
                            <option value="2">Honda</option>
                            <option value="55">Hummer</option>
                            <option value="56">Hyundai</option>
                            <option value="20">Infiniti</option>
                            <option value="108">Iran Khodro</option>
                            <option value="3">Isuzu</option>
                            <option value="121">JAC</option>
                            <option value="57">Jaguar</option>
                            <option value="58">Jeep</option>
                            <option value="59">Kia</option>
                            <option value="117">Koenigsegg</option>
                            <option value="60">Lamborghini</option>
                            <option value="61">Lancia</option>
                            <option value="62">Land Rover</option>
                            <option value="23">Lexus</option>
                            <option value="96">Lifan</option>
                            <option value="63">Lincoln</option>
                            <option value="64">Lotus</option>
                            <option value="113">Luxgen</option>
                            <option value="112">Marussia</option>
                            <option value="65">Maserati</option>
                            <option value="66">Maybach</option>
                            <option value="4">Mazda</option>
                            <option value="120">McLaren</option>
                            <option value="67">Mercedes-Benz</option>
                            <option value="68">Mercury</option>
                            <option value="69">Mini</option>
                            <option value="5">Mitsubishi</option>
                            <option value="22">Mitsuoka</option>
                            <option value="6">Nissan</option>
                            <option value="70">Oldsmobile</option>
                            <option value="71">Opel</option>
                            <option value="118">Pagani</option>
                            <option value="72">Peugeot</option>
                            <option value="73">Plymouth</option>
                            <option value="74">Pontiac</option>
                            <option value="75">Porsche</option>
                            <option value="76">Proton</option>
                            <option value="133">Ravon</option>
                            <option value="77">Renault</option>
                            <option value="92">Renault Samsung</option>
                            <option value="78">Rolls-Royce</option>
                            <option value="79">Rover</option>
                            <option value="80">Saab</option>
                            <option value="81">Saturn</option>
                            <option value="82">Scion</option>
                            <option value="83">SEAT</option>
                            <option value="84">Skoda</option>
                            <option value="85">Smart</option>
                            <option value="86">SsangYong</option>
                            <option value="7">Subaru</option>
                            <option value="8">Suzuki</option>
                            <option value="115">Tesla</option>
                            <option value="87">Tianye</option>
                            <option value="9">Toyota</option>
                            <option value="88">TVR</option>
                            <option value="89">Volkswagen</option>
                            <option value="90">Volvo</option>
                            <option value="107">Vortex</option>
                            <option value="122">Wiesmann</option>
                            <option value="91">Xin Kai</option>
                            <option value="136">Zotye</option>
                            <option value="124">ZX</option>
                            <option value="139">�����</option>
                            <option value="100">���</option>
                            <option value="104">���</option>
                            <option value="105">��</option>
                            <option value="99">����</option>
                            <option value="114">����</option>
                            <option value="102">�������</option>
                            <option value="111">������ ����</option>
                            <option value="103">�����</option>
                            <option value="101">���</option>
                        </Select>
                    </Div>
                    <Div className="buttons-group">
                        <Button size="l" stretched={true}>Сохранить</Button>
                        <Button size="l" stretched={true} onClick={this.clearForm}>Очистить</Button>
                    </Div>
                </Group>
            </Panel>
        );
    }
}

export default Addcar;