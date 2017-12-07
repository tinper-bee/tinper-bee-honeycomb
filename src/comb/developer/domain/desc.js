import {Row, Col} from 'tinper-bee';
import img from '../../assets/img/domain/domain.png';

function Desc() {
    return (
        <Row>
            <Col md="12">
                <h2 className="text-center">域名支持备案须知</h2>
                <p>
                    并非是市面上流通的域名后缀都可以备案的。需要域名后缀工信部收录后才允许开放备案，目前.pub/.rocks/.band/.market/software/.social/.lawyer/.engineer/.link/.click/.help/.gift/.pics/.photo/.news/.video/.win/.party/.date/.trade/.science/.online/.tech/.website/.space/.press/.wiki/.design/.live/.studio/.red/.loan/.bid/.mom/.lol/.work/.game/.store/.ltd
                    后缀的域名工信部暂未收录，故无法进行网站备案。
                </p>
                <p>
                    核实域名后缀是否收录，可以登录工信部公共查询网站进行查看。登陆后点击左侧的“公共查询”，再点击“域名类型”即可。如您购买的域名后缀无法进行备案申请，您可将域名指向海外免备案服务器，海外空间无需进行备案申请。
                </p>
                <img src={img} alt="域名查询" style={{ width: '100%' }} />
                <h2 className="text-center">国际域名能否备案</h2>
                <p>
                    国际域名：是以国家代码为后缀的顶级域名，例如：co: Colombia , 哥伦比亚；cc: Cocos Islands , 科科斯群岛；
                    us: United States , 美国；uk: United Kingdom , 英国；de: Germany , 德国；tv: Tuvalu , 图瓦鲁等都称为国别域名。
                    境外域名：是通过国外服务商注册的域名，您可以通过 <a href="http://whois.aliyun.com/"
                                                target="_blank">http://whois.aliyun.com/</a> 查询注册商参考
                </p>
                <p>
                    针对国际域名与境外域名管局规则如下：
                </p>
                <ul>
                    <li>湖南管局规定，域名注册商为国外的域名不能备案；</li>
                    <li>吉林管局规定，域名注册商为国外的域名不能备案；</li>
                    <li>内蒙古管局规定，域名注册商为国外的域名不能备案；</li>
                    <li>
                        北京管局规定允许备案域名后缀：.xin/.citic/.mobi/.中信/.tel/.wang/.ren/.商城/.网址/.com/.cn/.net/.cc/.tv/.top/.gov/.org/.中文后缀（例如：.中国/.网络/.公司）；不能使用国际域名及在境外注册的域名备案。
                    </li>
                </ul>
            </Col>
        </Row>
    )
}

export default Desc;
