import { MapPin } from 'lucide-react'
import React from 'react'

const GeographicalDetailsSection = ({ SettingsSection, SelectField, FormField, register, errors }) => {

  const continents = [{ value: "Africa", label: "Africa" }, { value: "Antarctica", label: "Antarctica" }, { value: "Asia", label: "Asia" }, { value: "Europe", label: "Europe" }, { value: "North America", label: "North America" }, { value: "South America", label: "South America" }, { value: "Oceania", label: "Oceania" }];

  return (
    <SettingsSection title="Geographic Details" description="Location and area" icon={MapPin}>

      <FormField label="Area" id="area" placeholder="e.g., 83,600 sq km" register={
        register("area",
          { pattern: { value: /^\d+(\.\d+)?$/, message: "Area is not valid" } }
        )} error={errors.area} helper="Total area in sq km" />

      <SelectField label="Continent" id="continent" register={
        register("continent")} options={continents} error={errors.continent} />

      <FormField label="Latitude" id="latitude" placeholder="e.g., 23.4241" register={
        register("latitude",
          { pattern: { value: /^[+-]?\d*\.?\d+$/, message: "Must be valid latitude" } }
        )} error={errors.latitude} helper="For map (optional)" />

      <FormField label="Longitude" id="longitude" placeholder="e.g., 53.8478" register={
        register("longitude",
          { pattern: { value: /^[+-]?\d*\.?\d+$/, message: "Must be valid longitude" } }
        )} error={errors.longitude} helper="For map (optional)" />

    </SettingsSection>
  )
}

export default GeographicalDetailsSection