import { Suspense, useEffect, useMemo, useState } from 'react';
import { AppProvider } from 'AppProvider';
import { includes, uniqueId } from 'lodash';
import { ClipLoader } from 'components/Loader';
import ProtocolList from './components/ProtocolList';
import NaturalDPDTProtocol from './components/NaturalDPDTProtocol';
import ArtificialDPDTProtocol from './components/ArtificialDPDTProtocol';
import ConventionalPDTProtocol from './components/ConventionalPDTProtocol';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import {
  naturalDPDT,
  combinedDPDT,
  artificialDPDT,
  naturalDPDTNew,
  combinedDPDTNew,
  conventionalDPDT,
  artificialDPDTNew,
  naturalDPDTEdit,
  combinedDPDTEdit,
  artificialDPDTEdit,
  conventionalDPDTNew,
  conventionalDPDTEdit,
  diseaseNatDpdtProtocol,
  naturalDPDTIdEdit,
} from 'routes';
import { combinedPDTList, conventionalPDTList } from './makeData';
import { useAllProtocolsData, useGetDiseaseList } from './api/query';
import {
  formatArtificialDPDTProtocol,
  formatDiseasesList,
  formatNaturalDPDTProtocol,
} from './api/format';
import DiseaseTypeList from './components/DiseasesTypeList';
import { useLocalStorage } from '~/utils/hooks';

export default function ProtocolIndexPage() {
  const location = useLocation();
  const {
    t,
    cookies: {
      user: { token },
    },
  } = AppProvider.useContainer();
  const { data, isLoading } = useAllProtocolsData(token);
  const { data: diseasesListData, isLoading: isLoadingDiseasesData } =
    useGetDiseaseList(token);

  const [tableStateText, setTableStateText] = useState<string>(
    t('No_data_available')
  );
  const isStateError = !isLoading && data && 'error' in data ? true : false;
  const [selectedProtocol, setSelectedProtocol] = useState<{
    id: string;
    protocolName: string;
  } | null>(null);
  const [selectedDisease, setSelectedDisease] = useLocalStorage<{
    uid: string;
    diseaseName: string;
  }>('selected-diseases', {
    uid: '',
    diseaseName: '',
  });

  const diseasesList = useMemo(() => {
    return diseasesListData && 'diseases' in diseasesListData
      ? formatDiseasesList(diseasesListData.diseases)
      : [];
  }, [diseasesListData, isLoadingDiseasesData]);

  const naturaldPDTList = useMemo(() => {
    return data && 'naturalPDTList' in data
      ? formatNaturalDPDTProtocol({
          data: data.naturalPDTList,
          diseaseTypeUid: selectedDisease?.uid,
        })
      : [];
  }, [t, data, selectedDisease.uid]);

  const artificialDPDTList = useMemo(() => {
    return data && 'artificialPDTList' in data
      ? formatArtificialDPDTProtocol(data.artificialPDTList, t)
      : [];
  }, [t, data]);

  useEffect(() => {
    let mounted = true;
    if (mounted && isStateError) {
      setTableStateText(t('Error.protocol.fetch'));
    }

    if (mounted && !isStateError) {
      setTableStateText(t('No_data_available'));
    }

    return () => {
      mounted = false;
    };
  }, [t, isStateError]);

  const isSelectedPage = (pageName: string) =>
    includes(location.pathname, pageName);

  const navLinks = [
    {
      to: naturalDPDT,
      isSelected: isSelectedPage('natural-dpdt'),
      text: t('natural-dpdt-title'),
      isDisabled: false,
    },
    {
      to: artificialDPDT,
      isSelected: isSelectedPage('artificial-dpdt'),
      text: t('artificial-dpdt-title'),
      isDisabled: true,
    },
    {
      to: conventionalDPDT,
      isSelected: isSelectedPage('conventional-pdt'),
      text: t('conventional-pdt-title'),
      isDisabled: true,
    },
    {
      to: combinedDPDT,
      isSelected: isSelectedPage('combined-pdt'),
      text: 'Combined PDT',
      isDisabled: true,
    },
  ];

  return (
    <div className='flex w-full h-full max-h-screen overflow-hidden bg-dashboard'>
      <div className='flex flex-shrink-0 h-full px-5 pt-6 bg-white border-r border-gray-200'>
        <div className='min-w-[85px] 2xl:min-w-[90px] flex flex-col text-black space-y-4'>
          {navLinks.map((link) => (
            <Link
              key={uniqueId('records-link-')}
              to={!link.isDisabled ? link.to : '#'}
              className={`${link.isSelected ? 'font-bold' : 'font-normal'}
                ${
                  link.isDisabled
                    ? 'cursor-not-allowed text-gray-400'
                    : 'hover:text-gray'
                }
               `}
            >
              <p className='relative group'>
                {link.isDisabled && (
                  <span className='absolute z-10 hidden w-24 py-2 mx-auto text-center text-gray-100 -translate-x-1/2 translate-y-full bg-gray-700 rounded-md transition-display xl:text-xs text-xxs group-hover:block left-1/2'>
                    {t('coming_soon')}
                  </span>
                )}
                <span>{link.text}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className='w-full h-full overflow-auto'>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
              <ClipLoader color='#1e477f' size={1.5} />
            </div>
          }
        >
          <Switch>
            {/* Protocol list page routes */}
            <Route exact path={naturalDPDT}>
              <DiseaseTypeList
                listData={diseasesList}
                isStateError={isStateError}
                tableStateText={tableStateText}
                selectedDisease={selectedDisease}
                isDataLoading={isLoadingDiseasesData}
                setSelectedDisease={setSelectedDisease}
              />
            </Route>
            <Route exact path={artificialDPDT}>
              <ProtocolList
                listData={artificialDPDTList}
                isStateError={isStateError}
                tableStateText={tableStateText}
                addProtocolUrl={artificialDPDTNew}
                selectedDisease={selectedDisease}
                selectedProtocol={selectedProtocol}
                setSelectedProtocol={setSelectedProtocol}
              />
            </Route>
            <Route exact path={conventionalDPDT}>
              <ProtocolList
                listData={conventionalPDTList}
                isStateError={isStateError}
                tableStateText={tableStateText}
                selectedDisease={selectedDisease}
                addProtocolUrl={conventionalDPDTNew}
                selectedProtocol={selectedProtocol}
                setSelectedProtocol={setSelectedProtocol}
              />
            </Route>
            <Route exact path={combinedDPDT}>
              <ProtocolList
                isStateError={isStateError}
                tableStateText={tableStateText}
                listData={combinedPDTList}
                addProtocolUrl={combinedDPDTNew}
                selectedDisease={selectedDisease}
                selectedProtocol={selectedProtocol}
                setSelectedProtocol={setSelectedProtocol}
              />
            </Route>

            {/* Edit protocols page routes */}
            <Route
              path={[
                naturalDPDTEdit(selectedDisease?.diseaseName),
                naturalDPDTIdEdit(selectedDisease?.diseaseName),
              ]}
            >
              <NaturalDPDTProtocol
                selectedDiseaseTypeUid={selectedDisease?.uid}
              />
            </Route>
            <Route exact path={artificialDPDTEdit}>
              <ArtificialDPDTProtocol />
            </Route>
            <Route exact path={conventionalDPDTEdit}>
              <ConventionalPDTProtocol />
            </Route>
            <Route exact path={combinedDPDTEdit}>
              <NaturalDPDTProtocol
                selectedDiseaseTypeUid={selectedDisease?.uid}
              />
            </Route>

            {/* New protocols page routes */}
            <Route exact path={naturalDPDTNew}>
              <NaturalDPDTProtocol
                selectedDiseaseTypeUid={selectedDisease?.uid}
              />
            </Route>
            <Route exact path={artificialDPDTNew}>
              <ArtificialDPDTProtocol />
            </Route>
            <Route exact path={conventionalDPDTNew}>
              <ConventionalPDTProtocol />
            </Route>
            <Route exact path={combinedDPDTNew}>
              <NaturalDPDTProtocol
                selectedDiseaseTypeUid={selectedDisease?.uid}
              />
            </Route>

            {/* Selected disease protocol page routes */}
            <Route
              exact
              path={diseaseNatDpdtProtocol(
                selectedDisease ? selectedDisease.uid : ''
              )}
            >
              <ProtocolList
                listData={naturaldPDTList}
                isStateError={isStateError}
                tableStateText={tableStateText}
                addProtocolUrl={naturalDPDTNew}
                selectedDisease={selectedDisease}
                selectedProtocol={selectedProtocol}
                setSelectedProtocol={setSelectedProtocol}
              />
            </Route>
            {/* Redirect to natural dPDT page */}
            <Route exact path='*'>
              <Redirect push to={naturalDPDT} />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}
