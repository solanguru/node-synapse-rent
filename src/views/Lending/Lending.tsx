import { useSelector } from "react-redux";
import { Box, Grid, styled } from "@material-ui/core";
import { trim } from "../../helpers";
import "./lending.scss";
// import { Skeleton } from "@material-ui/lab";
import BasicTable from "../Zap/BasicTable";
import React from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useAppSelector } from "src/hooks";
import { useAccount } from "wagmi";
import { FilterDrama } from "@mui/icons-material";
// import { IReduxState } from "../../store/slices/state.interface";
// import { IAppSlice } from "../../store/slices/app-slice";
// // import { useHistory } from "react-router-dom";
// import { usePathForNetwork, useWeb3Context } from "../../hooks";

const PanelTabs = styled(Tab)({
  textDecoration: 'none',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
  border: 'none',
  '&:hover': {
    textDecoration: 'none', // Remove underline on hover
    border: 'none',
    backgroundColor: 'transparent', // Set background color to none on hover
  },
});

function Dashboard() {
  // const history = useHistory();
  // const { chainID } = useWeb3Context();
  // usePathForNetwork({ pathName: "dashboard", networkID: chainID, history });

  // const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  // const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const { address = "", isConnected } = useAccount();
  const purchaseNodeData = useAppSelector(state => state.accountGallery.items);
  const purchaseNode = purchaseNodeData.filter(node => node.seller_address === address)
  
  // const pastPayout = purchaseNode.length * purchaseNode.node_price;
  let pastPayout = 0
  purchaseNode.forEach(purchaseNode => {
    if (purchaseNode.seller_address === address) {
      pastPayout += purchaseNode.purchase;
    }
  })
  console.log('debug gallerylending', pastPayout)

  const approveNodeData = useAppSelector(state => state.gallery.items);
  const approveNode = approveNodeData.filter(node => node.seller_address === address && node.approve === 1);
  
  const totalNodeData = useAppSelector(state => state.adminGallery.items);
  const totalNode = totalNodeData.filter(node => node.seller_address === address);
  let EstimatedPayout = 0;
  totalNodeData.forEach(node => {
    if (node.seller_address === address) {
      EstimatedPayout += node.node_price;
    }
  });

  const activeEstimatedPayout = EstimatedPayout - pastPayout;
  console.log('debug activeEstimatedPayout', activeEstimatedPayout);

  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="dashboard-view">
      <div className="dashboard-infos-wrap">
        {/* <Zoom in={true}> */}
        <Grid container spacing={4}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Approved Nodes</p>
              <p className="card-value">{approveNode.length}</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Total Nodes</p>
              <p className="card-value">{totalNode.length}</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Active Estimated Payout</p>
              <p className="card-value">{activeEstimatedPayout.toFixed(6)} ETH</p>
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div className="dashboard-card">
              <p className="card-title">Past Payout</p>
              <p className="card-value">{pastPayout.toFixed(6)} ETH</p>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="dashboard-infos-wrap" style={{ paddingTop: "30px" }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className="dashboard-card">
            <Box sx={{ width: '100%' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="" style={{ paddingLeft: '20px' }}>
                    <PanelTabs style={{ textDecoration: "none" }} label="My Nodes" value="1" />
                    <PanelTabs style={{ textDecoration: "none" }} label="Rentals" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1"><BasicTable /></TabPanel>
                <TabPanel value="2"><BasicTable /></TabPanel>
              </TabContext>
            </Box>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Dashboard;