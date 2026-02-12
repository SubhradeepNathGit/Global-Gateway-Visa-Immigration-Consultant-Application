export function calculateProcessingRange(startDateString, processingTimeString) {
    if (!startDateString || !processingTimeString) return null;

    const cleanedStart = startDateString.replace(" at ", " ");

    const startDate = new Date(cleanedStart);

    if (isNaN(startDate)) {
        console.error("Invalid start date:", startDateString);
        return null;
    }

    const days = processingTimeString.match(/\d+/g)?.map(Number);

    if (!days?.length) return null;

    const minDays = days[0];
    const maxDays = days[1] || days[0];

    const minDate = new Date(startDate);
    minDate.setDate(startDate.getDate() + minDays);

    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + maxDays);

    const options = { year: "numeric", month: "long", day: "numeric" };

    return {
        from: minDate.toLocaleDateString("en-US", options),
        to: maxDate.toLocaleDateString("en-US", options)
    };
}