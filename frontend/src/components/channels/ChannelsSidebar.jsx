import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import RemovableChannel from "./removableChannel";
import UnremovableChannel from "./unremovableChannel";
import { setAddModalActive } from "../../slices/modalSlice.js";

const ChannelsSidebar = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const channelContent = useSelector(state => state.channels.channels);

    const renderChannels = () => {
        if (channelContent.length === 0){
            return <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"></ul>
        } 
        return (
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                {channelContent.map((channel) => (
                <li className="nav-item w-100" key={channel.id}>
                    {(channel.removable === true) ? 
                    <RemovableChannel channelData = {channel}/>
                    : <UnremovableChannel channelData = {channel}/>
                    }
                </li>
                ))}
            </ul>
        );
    };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex"> 
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t("mainPage.channelsTitle")}</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => dispatch(setAddModalActive(true))}> 
                +
            </button>
        </div>
        {renderChannels()}
    </div>
  )
};

export default ChannelsSidebar;